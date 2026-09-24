import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, Button, Text, Card, HelperText } from 'react-native-paper';
import { supabase } from '../supabase';

export default function MisAhorros() {
  const [usuario, setUsuario] = useState('');
  const [monto, setMonto] = useState('');
  const [ahorros, setAhorros] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const nombre = usuario.trim();
    if (nombre === '') {
      setAhorros([]);
      return;
    }
    // Espera a que se deje de escribir y descarta respuestas de nombres anteriores
    let cancelado = false;
    const timer = setTimeout(async () => {
      const resultado = await fetchAhorros(nombre);
      if (!cancelado) aplicarResultado(resultado);
    }, 500);
    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [usuario]);

  const fetchAhorros = (nombre) =>
    supabase
      .from('users')
      .select('*')
      .eq('usuario', nombre)
      .order('created_at', { ascending: false });

  const aplicarResultado = ({ data, error }) => {
    if (error) {
      setError('No se pudieron cargar los ahorros: ' + error.message);
    } else {
      setError('');
      setAhorros(data);
    }
  };

  const addAhorro = async () => {
    const nombre = usuario.trim();
    // Acepta coma o punto como separador decimal
    const valor = Number(monto.trim().replace(',', '.'));
    if (!nombre) {
      setError('Escribe un usuario.');
      return;
    }
    if (!monto.trim() || !Number.isFinite(valor) || valor <= 0) {
      setError('Escribe un monto válido mayor que 0.');
      return;
    }
    const { error } = await supabase
      .from('users')
      .insert([{ usuario: nombre, monto: valor }]);
    if (error) {
      setError('No se pudo guardar: ' + error.message);
      return;
    }
    setMonto('');
    aplicarResultado(await fetchAhorros(nombre));
  };

  const total = ahorros.reduce((sum, item) => sum + (Number(item.monto) || 0), 0);

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
      <HelperText type="error" visible={error !== ''}>
        {error}
      </HelperText>
      <Button mode="contained" onPress={addAhorro} style={styles.button}>
        Guardar
      </Button>

      <Text style={styles.total}>Total ahorrado: ${total.toFixed(2)}</Text>

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
