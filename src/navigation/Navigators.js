import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RamadhanProvider } from '../context/RamadhanContext';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import IbadahScreen from '../screens/IbadahScreen';
import ReminderScreen from '../screens/ReminderScreen';
import RekapScreen from '../screens/RekapScreen';
import DayDetailScreen from '../screens/DayDetailScreen';
import AkunScreen from '../screens/AkunScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminContentScreen from '../screens/AdminContentScreen';
import AdminUserDetailScreen from '../screens/AdminUserDetailScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const icons = {
  Beranda: '🌙', Ibadah: '✅', Pengingat: '⏰', Rekap: '📅', Akun: '👤',
  Dasbor: '📊', Konten: '📝',
};

const tabOptions = ({ route }) => ({
  headerStyle: { backgroundColor: COLORS.night },
  headerTintColor: COLORS.white,
  tabBarActiveTintColor: COLORS.night,
  tabBarIcon: () => <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>,
});

// Tab "Rekap" berisi Stack: daftar rekap -> detail hari
function RekapStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.night },
        headerTintColor: COLORS.white,
      }}
    >
      <Stack.Screen name="RekapMain" component={RekapScreen} options={{ title: 'Rekap Ramadhan' }} />
      <Stack.Screen name="DayDetail" component={DayDetailScreen} options={{ title: 'Detail hari' }} />
    </Stack.Navigator>
  );
}

function UserTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen name="Beranda" component={HomeScreen} options={{ title: 'RamadhanKu' }} />
      <Tab.Screen name="Ibadah" component={IbadahScreen} options={{ title: 'Ibadah Harian' }} />
      <Tab.Screen name="Pengingat" component={ReminderScreen} />
      <Tab.Screen name="Rekap" component={RekapStack} options={{ headerShown: false }} />
      <Tab.Screen name="Akun" component={AkunScreen} />
    </Tab.Navigator>
  );
}

// Area pengguna: data ibadah dimuat sesuai akun yang sedang masuk
export function UserArea() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <RamadhanProvider key={user.id} userId={user.id}>
      <UserTabs />
    </RamadhanProvider>
  );
}

// Tab "Dasbor" berisi Stack: daftar pengguna -> detail pengguna
function AdminDashStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.night },
        headerTintColor: COLORS.white,
      }}
    >
      <Stack.Screen name="DasborMain" component={AdminDashboardScreen} options={{ title: 'Dasbor Admin' }} />
      <Stack.Screen name="UserDetail" component={AdminUserDetailScreen} options={{ title: 'Detail pengguna' }} />
    </Stack.Navigator>
  );
}

export function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen name="Dasbor" component={AdminDashStack} options={{ headerShown: false }} />
      <Tab.Screen name="Konten" component={AdminContentScreen} options={{ title: 'Kelola Konten' }} />
      <Tab.Screen name="Akun" component={AkunScreen} />
    </Tab.Navigator>
  );
}
