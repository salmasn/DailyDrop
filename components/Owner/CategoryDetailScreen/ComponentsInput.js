import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

/**
 * Composant pour gérer les composants du plat
 */
const ComponentsInput = ({ 
  dishComponents, 
  currentComponent, 
  setCurrentComponent, 
  handleAddComponent, 
  handleRemoveComponent 
}) => {
  return (
    <View style={styles.formSection}>
      <Text style={styles.formLabel}>Composants du plat</Text>
      <View style={styles.componentInputContainer}>
        <TextInput
          style={styles.componentInput}
          placeholder="ex: Fromage, Tomate..."
          value={currentComponent}
          onChangeText={setCurrentComponent}
          placeholderTextColor="#999"
          onSubmitEditing={handleAddComponent}
        />
        <TouchableOpacity 
          style={styles.addComponentButton}
          onPress={handleAddComponent}
        >
          <Image
            source={require('../../../assets/Icons/add.png')}
            style={styles.addComponentIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      
      {dishComponents.length > 0 && (
        <View style={styles.componentsListContainer}>
          {dishComponents.map((component, index) => (
            <View key={index} style={styles.componentChip}>
              <Text style={styles.componentChipText}>{component}</Text>
              <TouchableOpacity 
                onPress={() => handleRemoveComponent(component)}
                style={styles.removeComponentButton}
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
  componentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  componentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  addComponentButton: {
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
  componentsListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  componentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  componentChipText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  removeComponentButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeComponentText: {
    color: '#2e7d32',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default ComponentsInput;