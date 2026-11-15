import React from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import { UserArea, AdminTabs } from './src/navigation/Navigators';
import { COLORS } from './src/utils/constants';

const Root = createNativeStackNavigator();

// Layar yang tampil bergantung pada status masuk dan peran (user / admin)
function Routes() {
  const { ready, user } = useAuth();

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.night, justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Root.Screen name="Login" component={LoginScreen} />
        ) : user.role === 'admin' ? (
          <Root.Screen name="AdminArea" component={AdminTabs} />
        ) : (
          <Root.Screen name="UserArea" component={UserArea} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.nightDark} />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
