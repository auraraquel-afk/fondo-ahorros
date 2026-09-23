import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { supabase } from '../supabase';

export default function MisAhorros() {
  const [usuario, setUsuario] = useState('');
  const [monto, setMonto] = useState('');
  const [ahorros, setAhorros] = useState([]);

  useEffect(() => {
    if (usuario.trim() !== '') {
      fetchAhorros();
    }
  }, [usuario]);

  const fetchAhorros = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('usuario', usuario)
      .order('created_at', { ascending: false });
    if (!error) setAhorros(data);
  };

  const addAhorro = async () => {
    if (!usuario.trim() || !monto.trim()) return;
    const { error } = await supabase
      .from('users')
      .insert([{ usuario, monto: parseFloat(monto) }]);
    if (!error) {
      setMonto('');
      fetchAhorros();
    }
  };

  const total = ahorros.reduce((sum, item) => sum + parseFloat(item.monto), 0);

  return (
    <View style={styles.container}>
      <TextInput
        label="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        style={styles.input}
      />
      <TextInput
        label="Monto de ahorro"
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button mode="contained" onPress={addAhorro} style={styles.button}>
        Guardar
      </Button>

      <Text style={styles.total}>Total ahorrado: {total}</Text>

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
  input: { marginBottom: 10 },
  button: { marginBottom: 20 },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  card: { marginBottom: 10 }
});