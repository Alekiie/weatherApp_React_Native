import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AccountService from "../config/AccountService";
import { Input, Button } from "react-native-elements";

const WeatherHunt = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const data = await AccountService.getCitySuggestions(location);
      setSuggestions(data);
      setModalVisible(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setLocation(suggestion.name);
    setSelectedSuggestion(suggestion);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      let weatherData;
      if (selectedSuggestion) {
        weatherData = await AccountService.getWeather(
          selectedSuggestion.lat,
          selectedSuggestion.lon
        );
      } else {
        const coordinates = await AccountService.getCoordinates(location);
        weatherData = await AccountService.getWeather(
          coordinates.lat,
          coordinates.lon
        );
      }
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // console.log(weather)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <Text style={styles.header}>WEATHER HUNTER</Text>
          <Text style={styles.description}>
            Enter a city or zip code to find the weather information.
          </Text>
          <View style={styles.searchContainer}>
            <Input
              placeholder="Enter city or zip code"
              value={location}
              onChangeText={(value) => {
                setLocation(value);
                setSelectedSuggestion(null);
              }}
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Search"
                onPress={handleSearch}
                buttonStyle={styles.button}
              />
              <Button
                title="Get Weather"
                onPress={handleSubmit}
                buttonStyle={styles.button}
              />
            </View>
          </View>
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {loading && <ActivityIndicator size="large" color="#0000ff" />}
                {suggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <Text style={styles.suggestionItem}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {error && <Text style={styles.error}>{error}</Text>}
          {weather && (
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherTitle}>{weather.name}</Text>
              <Text style={styles.weatherDescription}>
                {weather.weather[0]?.description || "No description available"}
              </Text>
              <Text style={styles.weatherTemp}>{weather.main.temp} °C</Text>
              <Image
                style={styles.weatherIcon}
                source={{
                  uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                }}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0059b3",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  searchContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  inputContainer: {
    width: 300,
  },
  input: {
    borderColor: "#0059b3",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#0059b3",
    borderRadius: 8,
    width: 140,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  error: {
    color: "red",
    marginVertical: 10,
  },
  weatherInfo: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
  },
  weatherTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  weatherDescription: {
    fontSize: 18,
    textTransform: "capitalize",
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0059b3",
    marginBottom: 10,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
});

export default WeatherHunt;
