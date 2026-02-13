import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DAYS_OF_WEEK } from '../../../hooks/CategoryDetails/Usedishtimeslots';

/**
 * Composant pour gérer les créneaux horaires
 */
const TimeslotsInput = ({ 
  timeslots,
  currentDay,
  setCurrentDay,
  currentStartTime,
  setCurrentStartTime,
  currentEndTime,
  setCurrentEndTime,
  handleAddTimeslot,
  handleRemoveTimeslot
}) => {
  return (
    <View style={styles.formSection}>
      <Text style={styles.formLabel}>Créneaux horaires</Text>
      
      {/* Day Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={currentDay}
          onValueChange={setCurrentDay}
          style={styles.picker}
        >
          {DAYS_OF_WEEK.map((day) => (
            <Picker.Item key={day} label={day} value={day} />
          ))}
        </Picker>
      </View>

      {/* Time Inputs */}
      <View style={styles.timeInputsContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.timeLabel}>Début</Text>
          <TextInput
            style={styles.timeInput}
            placeholder="14:00"
            value={currentStartTime}
            onChangeText={setCurrentStartTime}
            placeholderTextColor="#999"
          />
        </View>
        <Text style={styles.timeSeparator}>-</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.timeLabel}>Fin</Text>
          <TextInput
            style={styles.timeInput}
            placeholder="17:00"
            value={currentEndTime}
            onChangeText={setCurrentEndTime}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity 
          style={styles.addTimeslotButton}
          onPress={handleAddTimeslot}
        >
          <Image
            source={require('../../../assets/Icons/add.png')}
            style={styles.addComponentIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Timeslots List */}
      {timeslots.length > 0 && (
        <View style={styles.timeslotsListContainer}>
          {timeslots.map((timeslot) => (
            <View key={timeslot.id} style={styles.timeslotChip}>
              <View style={styles.timeslotContent}>
                <Text style={styles.timeslotDay}>{timeslot.day}</Text>
                <Text style={styles.timeslotTime}>
                  {timeslot.start_time} - {timeslot.end_time}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleRemoveTimeslot(timeslot.id)}
                style={styles.removeTimeslotButton}
              >
                <Text style={styles.removeComponentText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  timeSeparator: {
    fontSize: 20,
    color: '#666',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  addTimeslotButton: {
    backgroundColor: '#5a2c1c',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addComponentIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  timeslotsListContainer: {
    marginTop: 12,
    gap: 8,
  },
  timeslotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  timeslotContent: {
    flex: 1,
  },
  timeslotDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 2,
  },
  timeslotTime: {
    fontSize: 12,
    color: '#f57c00',
  },
  removeTimeslotButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeComponentText: {
    color: '#e65100',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default TimeslotsInput;