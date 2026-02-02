import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

function HomeScreen({ navigation }) 
{ 
  const handleStart = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/restaurant.jpg')}
        style={styles.backgroundImage}
      />
      
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome
        </Text>
        
        <Text style={styles.description}>
          Discover DailyDrop, the anti-waste app that links you to restaurants offering end-of-day meals at discounted prices. Save money, and enjoy delicious food! 
        </Text>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1
  },
  content: {
    position: 'absolute',
    bottom: 40,
    left: 10,
    right: 10,
    zIndex: 2,
    maxWidth: 600
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8
  },
  description: {
    color: 'white',
    fontSize: 17,
    lineHeight: 27,
    textShadowColor: 'rgba(59, 59, 59, 0.49)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginRight: 42,
    marginBottom: 20
  },
  startButton: {
    backgroundColor: '#5a2c1cff',
    paddingVertical: 12,
    width: 120,
    borderRadius: 30,
    shadowColor: '#441a0bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
    alignSelf: 'flex-start',
    marginLeft: 200,
    borderColor: '#412116ff',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default HomeScreen;