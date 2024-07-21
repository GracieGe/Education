import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import LanguageItem from '../components/LanguageItem';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// select language
const SettingsLanguage = () => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCheckboxPress = (itemTitle, langCode) => {
    if (selectedItem === itemTitle) {
      // If the clicked item is already selected, deselect it
      setSelectedItem(null);
    } else {
      // Otherwise, select the clicked item
      setSelectedItem(itemTitle);
      i18n.changeLanguage(langCode);
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title={t('languageRegion')} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: COLORS.black }]}>{t('chooseLanguage')}</Text>
          <View style={{ marginTop: 12 }}>
            <LanguageItem
              checked={selectedItem === 'English'}
              name="English"
              onPress={() => handleCheckboxPress('English', 'en')}
            />
            <LanguageItem
            checked={selectedItem === '中文'}
            name="中文"
            onPress={() => handleCheckboxPress('中文', 'zh')}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  title: {
    fontSize: 20,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    marginVertical: 16
  }
})

export default SettingsLanguage