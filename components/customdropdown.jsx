import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";

const CustomDropdown = ({ data, placeholder, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelect = (item) => {
    setSelectedValue(item);
    setIsVisible(false);
    onSelect(item); 
  };

  return (
    <View className="w-4/5 my-2">
      {/* Dropdown Button */}
      <TouchableOpacity
        className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-300"
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text className="text-base text-gray-700">
          {selectedValue ? selectedValue.label : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Dropdown List */}
      {isVisible && (
        <Modal transparent animationType="fade"  className="flex-1 justify-center items-center">
          <TouchableOpacity
            className="flex-1 justify-center items-center bg-black bg-opacity-10"
            onPress={() => setIsVisible(false)}
          >
            <View className="mt-2 bg-white rounded-lg border border-gray-300 w-30 h-40">
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="px-4 py-3 border-b border-gray-200"
                    onPress={() => handleSelect(item)}
                  >
                    <Text className="text-base text-gray-700">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default function App() {
  const options = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ];

  const handleSelect = (item) => {
    console.log("Selected item:", item);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <CustomDropdown
        data={options}
        placeholder="Select an option"
        onSelect={handleSelect}
      />
    </View>
  );
}
