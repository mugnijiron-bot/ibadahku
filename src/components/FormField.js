import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: kolom isian berlabel (props: label, value, onChangeText, secure, multiline, align, ...)
export default function FormField({
  label, value, onChangeText, placeholder, secure, multiline, align, keyboardType, autoCapitalize = 'none',
}) {
  return (
    <View style={s.wrap}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput
        style={[s.input, multiline && s.multi, align && { textAlign: align }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secure}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoCorrect={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.ink, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.line, fontSize: 15, color: COLORS.ink,
  },
  multi: { minHeight: 80, textAlignVertical: 'top' },
});
