import React, { useState } from 'react';
import { View, Text, Button, Image, TextInput, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { registrarRostro, verificarRostro } from './api';

export default function App() {
  const [nombre, setNombre] = useState<string>('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [resultado, setResultado] = useState<string>('');

  const tomarFoto = async (): Promise<void> => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Necesitas habilitar la cámara.');
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!res.canceled && res.assets[0]) {
      setFotoUri(res.assets[0].uri);
      setFotoBase64(res.assets[0].base64 ?? null);
    }
  };

  const ejecutarOperacion = async (operacion: 'registrar' | 'verificar'): Promise<void> => {
    if (!nombre.trim()) {
      Alert.alert('Falta el nombre', 'Escribe el nombre de usuario.');
      return;
    }

    if (!fotoBase64) {
      Alert.alert('Error', 'Primero toma una foto.');
      return;
    }

    try {
      setResultado('Procesando...');
      const payload = { nombre: nombre.trim(), image: fotoBase64 };
      const data =
        operacion === 'registrar'
          ? await registrarRostro(payload)
          : await verificarRostro(payload);
      setResultado(JSON.stringify(data, null, 2) ?? String(data));
    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido';
      setResultado('Error: ' + mensaje);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Reconocimiento Facial</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={nombre}
        onChangeText={setNombre}
      />
      <Button title="1. Tomar Foto" onPress={tomarFoto} />
      {fotoUri && <Image source={{ uri: fotoUri }} style={styles.preview} />}
      <View style={styles.botones}>
        <Button title="Registrar Rostro" onPress={() => ejecutarOperacion('registrar')} />
        <Button title="Verificar Rostro" onPress={() => ejecutarOperacion('verificar')} />
      </View>
      <Text style={styles.resultado}>{resultado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6 },
  preview: { width: 180, height: 180, alignSelf: 'center', borderRadius: 90 },
  botones: { gap: 8 },
  resultado: { marginTop: 10, fontSize: 13, color: '#333' },
});