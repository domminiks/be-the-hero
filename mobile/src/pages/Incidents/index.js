import React, {useEffect, useState} from 'react';
import { View, Image, FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {Feather} from '@expo/vector-icons'
import logoImg from '../../assets/logo.png'

import styles from './styles';

import api from '../../services/api';

export default function Incidents() {
    const navigation = useNavigation();

    const [totalCases, setTotalCases] = useState(0);
    const [incidents, setIncidents] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    function navigateToDetail(incident) {
        navigation.navigate('Detail', {incident});
    }

    async function loadIncidents() {
        if (loading) {
            return;
        }
        //
        if (totalCases > 0 && incidents.length === totalCases) {
            return;
        }
        setLoading(true);
        const response = await api.get('/incidents', {
            params : { page }
        });
        setIncidents([...incidents, ...response.data]);
        setTotalCases(response.headers['x-total-count']);
        setPage(page+1);
        setLoading(false);
    }

    useEffect (() => {
        loadIncidents();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total of <Text style={styles.headerTextBold}>{totalCases} incidents</Text>
                </Text>
            </View>

            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.description}>Pick an incident and save the day!</Text>
            <FlatList 
                style={styles.incidentList}
                data={incidents}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({item: incident}) => (
                    <View style={styles.incident}>
                        <Text style={styles.incidentProperty}>NGO:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}>Incident:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentProperty}>Amoutn:</Text>
                        <Text style={styles.incidentValue}>{Intl.NumberFormat('en', {style: 'currency', currency: 'USD'}).format(incident.value)}</Text>

                        <TouchableOpacity 
                            style={styles.detailsButton} 
                            onPress={() => navigateToDetail(incident)}
                        >
                            <Text style={styles.detailsButtonText}>See more details</Text>
                            <Feather name="arrow-right" size={16} color="#E02041"/>
                        </TouchableOpacity>
                    </View>
                )}
            />
                
        </View>
    );
}