import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// ✅ Liste des styles disponibles sur Google Maps
const MAP_STYLES = [
  { key: 'satellite', label: 'Satellite', icon: '🛰️' },
  { key: 'hybrid',   label: 'Hybrid',    icon: '🗺️'  },
  { key: 'standard', label: 'Standard',  icon: '📍'  },
];

function TrackRestaurantsScreen({ navigation }) {
  const mapRef = useRef(null);
  const [location, setLocation]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [mapType, setMapType]     = useState('satellite'); // ⚡ satellite par défaut

  const [camera, setCamera] = useState({
    latitude:      32.3708,
    longitude:    -6.4967,
    latitudeDelta:  0.008,
    longitudeDelta: 0.008,
  });

  const restaurants = [
    { id:'1', name:'Restaurant Marrakech', latitude:32.3710, longitude:-6.4970, category:'Marocain', rating:4.5 },
    { id:'2', name:'Pizza Palace',         latitude:32.3720, longitude:-6.4960, category:'Italien',  rating:4.8 },
    { id:'3', name:'Café Central',         latitude:32.3700, longitude:-6.4980, category:'Café',     rating:4.2 },
  ];

  /* ─── géolocalisation ─── */
  useEffect(() => { getCurrentLocation(); }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Requise', "Veuillez autoriser l'accès à la localisation");
        setLoading(false);
        return;
      }
      const cur = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({ latitude: cur.coords.latitude, longitude: cur.coords.longitude });
      setCamera(p => ({ ...p, latitude: cur.coords.latitude, longitude: cur.coords.longitude }));
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  /* ─── contrôles caméra ─── */
  const centerOnLocation = () => {
    if (!location || !mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: location.latitude, longitude: location.longitude,
      latitudeDelta: 0.008, longitudeDelta: 0.008,
    }, 1000);
    setCamera(p => ({ ...p, latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 }));
  };

  const activate3DView = () => {
    if (!mapRef.current) return;
    mapRef.current.animateCamera({
      center: { latitude: camera.latitude, longitude: camera.longitude },
      pitch: 55, zoom: 17, heading: 30,
    }, { duration: 1200 });
  };

  const zoomIn = () => {
    if (!mapRef.current) return;
    const d = Math.max(camera.latitudeDelta / 2, 0.001);
    setCamera(p => ({ ...p, latitudeDelta: d, longitudeDelta: d }));
    mapRef.current.animateToRegion({ latitude: camera.latitude, longitude: camera.longitude, latitudeDelta: d, longitudeDelta: d }, 300);
  };

  const zoomOut = () => {
    if (!mapRef.current) return;
    const d = Math.min(camera.latitudeDelta * 2, 0.5);
    setCamera(p => ({ ...p, latitudeDelta: d, longitudeDelta: d }));
    mapRef.current.animateToRegion({ latitude: camera.latitude, longitude: camera.longitude, latitudeDelta: d, longitudeDelta: d }, 300);
  };

  /* ─── loading ─── */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5a2c1c" />
        <Text style={styles.loadingText}>Chargement de la carte…</Text>
      </View>
    );
  }

  /* ─── render ─── */
  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurants Proches</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Sélecteur de style — row de petits boutons sous le header ── */}
      <View style={styles.styleRow}>
        {MAP_STYLES.map(s => {
          const active = mapType === s.key;
          return (
            <TouchableOpacity
              key={s.key}
              style={[styles.styleBtn, active && styles.styleBtnActive]}
              onPress={() => setMapType(s.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.styleBtnIcon}>{s.icon}</Text>
              <Text style={[styles.styleBtnLabel, active && styles.styleBtnLabelActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Google Map ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        initialCamera={{
          center: { latitude: camera.latitude, longitude: camera.longitude },
          zoom: 17,
          pitch: 45,  
          heading: 0,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        showsBuildings={true}             // bâtiments 3D
        pitchEnabled={true}               // inclinaison manuelle
        rotateEnabled={true}              // rotation manuelle
        zoomEnabled={true}
        scrollEnabled={true}
        loadingEnabled={true}
        loadingIndicatorColor="#5a2c1c"
        loadingBackgroundColor="#fff"
        onRegionChangeComplete={(r) =>
          setCamera(p => ({
            ...p,
            latitude: r.latitude, longitude: r.longitude,
            latitudeDelta: r.latitudeDelta, longitudeDelta: r.longitudeDelta,
          }))
        }
      >
        {/* Marqueur utilisateur */}
        {location && (
          <Marker coordinate={location} title="Votre Position" description="Vous êtes ici">
            <View style={styles.userMarker}>
              <View style={styles.userMarkerDot} />
            </View>
          </Marker>
        )}

        {/* Marqueurs restaurants */}
        {restaurants.map(r => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.latitude, longitude: r.longitude }}
            title={r.name}
            description={`${r.category} - ⭐ ${r.rating}`}
            onPress={() =>
              Alert.alert(r.name, `Catégorie : ${r.category}\nNote : ${r.rating}/5`, [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Voir Détails', onPress: () => console.log('details', r.id) },
              ])
            }
          >
            <View style={styles.restaurantMarker}>
              <View style={styles.markerPin}>
                <Text style={styles.markerIcon}>🍽️</Text>
              </View>
              <View style={styles.markerArrow} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* ── Contrôles droite ── */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={centerOnLocation}>
          <Text style={styles.ctrlIcon}>📍</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlBtn} onPress={activate3DView}>
          <Text style={styles.ctrlIcon}>🏙️</Text>
        </TouchableOpacity>

        <View style={styles.zoomWrap}>
          <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <View style={styles.zoomDiv} />
          <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut}>
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Légende bas ── */}
      <View style={styles.legendWrap}>
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>📍 {restaurants.length} restaurants trouvés</Text>
          <Text style={styles.legendSub}>Cliquez sur un marqueur pour plus d'infos</Text>
        </View>
      </View>
    </View>
  );
}

/* ════════════════════════════ STYLES ════════════════════════════ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  // loading
  loadingContainer: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff' },
  loadingText:      { marginTop:10, fontSize:16, color:'#666' },

  // ─── header ───
  header: {
    flexDirection:'row', justifyContent:'space-between', alignItems:'center',
    paddingHorizontal:20, paddingVertical:12,
    paddingTop: Platform.OS === 'ios' ? 55 : 35,
    backgroundColor:'#fff',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.12, shadowRadius:4,
    elevation:5, zIndex:10,
  },
  backButton:     { padding:5 },
  backButtonText: { fontSize:16, color:'#5a2c1c', fontWeight:'600' },
  headerTitle:    { fontSize:18, fontWeight:'bold', color:'#1a1a1a' },

  // ─── sélecteur de style ───
  styleRow: {
    position:'absolute',
    top: Platform.OS === 'ios' ? 108 : 82,   // sous le header
    left:0, right:0,
    flexDirection:'row',
    justifyContent:'center',
    gap:8,
    zIndex:20,
    paddingVertical:8,
  },
  styleBtn: {
    flexDirection:'row', alignItems:'center', gap:4,
    backgroundColor:'rgba(255,255,255,0.92)',
    borderRadius:20,
    paddingHorizontal:12, paddingVertical:6,
    borderWidth:1.5, borderColor:'transparent',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.22, shadowRadius:4,
    elevation:5,
  },
  styleBtnActive: {
    backgroundColor:'#5a2c1c',
    borderColor:'#5a2c1c',
  },
  styleBtnIcon:  { fontSize:15 },
  styleBtnLabel: { fontSize:12, fontWeight:'600', color:'#333' },
  styleBtnLabelActive: { color:'#fff' },

  // ─── carte ───
  map: { width, height },

  // ─── marqueur utilisateur ───
  userMarker: {
    width:26, height:26, borderRadius:13,
    backgroundColor:'#fff',
    justifyContent:'center', alignItems:'center',
    borderWidth:3, borderColor:'#4285F4',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.35, shadowRadius:3,
    elevation:6,
  },
  userMarkerDot: { width:12, height:12, borderRadius:6, backgroundColor:'#4285F4' },

  // ─── marqueur restaurant ───
  restaurantMarker: { alignItems:'center' },
  markerPin: {
    width:42, height:42, borderRadius:21,
    backgroundColor:'#5a2c1c',
    justifyContent:'center', alignItems:'center',
    borderWidth:3, borderColor:'#fff',
    shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.4, shadowRadius:4,
    elevation:8,
  },
  markerIcon: { fontSize:20 },
  markerArrow: {
    width:0, height:0, backgroundColor:'transparent', borderStyle:'solid',
    borderLeftWidth:7, borderRightWidth:7, borderTopWidth:11,
    borderLeftColor:'transparent', borderRightColor:'transparent', borderTopColor:'#5a2c1c',
    marginTop:-1,
  },

  // ─── contrôles droite ───
  controls: { position:'absolute', right:16, bottom:100, gap:12, zIndex:15 },
  ctrlBtn: {
    backgroundColor:'#fff', width:48, height:48, borderRadius:24,
    justifyContent:'center', alignItems:'center',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4,
    elevation:5,
  },
  ctrlIcon: { fontSize:22 },

  // zoom
  zoomWrap: {
    backgroundColor:'#fff', borderRadius:24, overflow:'hidden',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4,
    elevation:5,
  },
  zoomBtn:  { width:48, height:44, justifyContent:'center', alignItems:'center' },
  zoomText: { fontSize:24, fontWeight:'bold', color:'#333' },
  zoomDiv:  { height:1, backgroundColor:'#e0e0e0' },

  // ─── légende ───
  legendWrap: { position:'absolute', bottom:24, left:16, right:80, zIndex:15 },
  legend: {
    backgroundColor:'rgba(255,255,255,0.95)', borderRadius:14, padding:14,
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.18, shadowRadius:5,
    elevation:5,
  },
  legendTitle: { fontSize:14, fontWeight:'bold', color:'#1a1a1a', marginBottom:3 },
  legendSub:   { fontSize:12, color:'#666' },
});

export default TrackRestaurantsScreen;