import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, HelperText } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../supabase';

export default function TodosAhorros() {
  const [ahorros, setAhorros] = useState([]);
  const [error, setError] = useState('');

  // Recarga cada vez que la pantalla recibe el foco, no solo al montarse
  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [])
  );

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError('No se pudieron cargar los ahorros: ' + error.message);
    } else {
      setError('');
      setAhorros(data);
    }
  };

  return (
    <View style={styles.container}>
      <HelperText type="error" visible={error !== ''}>
        {error}
      </HelperText>
      <FlatList
        data={ahorros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>

              <Text>{item.usuario} - ${item.monto}</Text>
              <Text variant="bodySmall">{new Date(item.created_at).toLocaleString()}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: { marginBottom: 10 }
});