import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';

function CalendarScreen() {
  const handleAddOffer = () => {
    console.log('Add new offer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Calendar"
        subtitle="Manage daily offers"
        rightAction={handleAddOffer}
        rightIcon="+"
      />

      <ScrollView style={styles.content}>
        <View style={styles.weekContainer}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayCard, index === 2 && styles.dayCardActive]}
            >
              <Text style={[styles.dayText, index === 2 && styles.dayTextActive]}>
                {day}
              </Text>
              <Text style={[styles.dateText, index === 2 && styles.dateTextActive]}>
                {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          
          <View style={styles.offerCard}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>12:00</Text>
              <Text style={styles.timePeriod}>PM</Text>
            </View>
            <View style={styles.offerInfo}>
              <Text style={styles.offerTitle}>Lunch Special</Text>
              <Text style={styles.offerDescription}>
                Grilled chicken with vegetables
              </Text>
              <View style={styles.offerBadge}>
                <Text style={styles.badgeText}>30% OFF</Text>
              </View>
            </View>
          </View>

          <View style={styles.offerCard}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>19:00</Text>
              <Text style={styles.timePeriod}>PM</Text>
            </View>
            <View style={styles.offerInfo}>
              <Text style={styles.offerTitle}>Dinner Deal</Text>
              <Text style={styles.offerDescription}>
                Family combo for 4 people
              </Text>
              <View style={styles.offerBadge}>
                <Text style={styles.badgeText}>40% OFF</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  dayCard: {
    width: 45,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dayCardActive: {
    backgroundColor: '#5a2c1c',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dayTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateTextActive: {
    color: 'white',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a2c1c',
  },
  timePeriod: {
    fontSize: 12,
    color: '#999',
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ff6b35',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;