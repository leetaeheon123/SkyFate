import React, {useEffect, useState} from 'react';

import {SafeAreaView, Text, View} from 'react-native';

import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';

const AutoComScreen = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <SafeAreaView>
      <Text>Hello</Text>
      <AutocompleteDropdown
        containerStyle={{width: 300}}
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        initialValue={{id: '2'}} // or just '2'
        onSelectItem={setSelectedItem}
        dataSet={dataset}
      />
    </SafeAreaView>
  );
};

export const dataset = [
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
  {id: '2', title: 'Beta'},
  {id: '3', title: 'Gamma'},
  {id: '1', title: 'Alpha'},
];

export default AutoComScreen;

