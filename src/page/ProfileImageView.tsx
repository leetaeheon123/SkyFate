import {View, Text, SafeAreaView, Image} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {GetUserData} from '^/SaveUserDataInDevice';
import Swiper from 'react-native-swiper';
import {Btn_ClickableBack} from 'component/General';
import styles from '~/ManToManBoard';
import {HPer15} from '~/Per';

const ProfileImageViewScreen = ({route, navigation}: any) => {
  const {UserEmail} = route.params;

  // let UserData: undefined | Object;

  const [UserDataState, setUserData] = useState();
  const [FiliterImageArray, setImageArray] = useState();

  const Statelize = async () => {
    const UserData = await GetUserData(UserEmail);
    setUserData(UserData);

    const ImageArray = [
      UserData.ProfileImageUrl,
      UserData.ProfileImageUrl2,
      UserData.ProfileImageUrl3,
      UserData.ProfileImageUrl4,
      UserData.ProfileImageUrl5,
      UserData.ProfileImageUrl6,
    ];

    setImageArray(ImageArray.filter((data) => data != '' && data != undefined));
  };

  useEffect(() => {
    async function Init() {
      await Statelize();
    }
    Init();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={[
          {
            width: '100%',
            height: '100%',
          },
        ]}>
        <Btn_ClickableBack
          onPress={() => {
            navigation.goBack();
          }}
          style={{position: 'absolute', left: 12, top: 12}}
          width={12}
        />

        {UserDataState && (
          <>
            {FiliterImageArray && (
              <View
                style={{
                  width: '100%',
                  height: '70%',
                  marginTop: HPer15,
                }}>
                <Swiper
                  paginationStyle={{
                    width: '70%',
                    height: 2.5,
                    position: 'absolute',
                    top: 24,
                    left: '15%',
                    display: 'flex',
                    flexDirection: 'row',
                    zIndex: 10,
                  }}
                  dot={
                    <View
                      style={{
                        height: '100%',
                        width: `${100 / FiliterImageArray.length}%`,
                        backgroundColor: '#00000014',
                        borderRadius: 4,
                        marginLeft: 4.5,
                      }}
                    />
                  }
                  activeDot={
                    <View
                      style={{
                        height: '100%',
                        width: `${100 / FiliterImageArray.length}%`,
                        backgroundColor: 'white',
                        borderRadius: 4,
                        marginLeft: 4.5,
                      }}
                    />
                  }>
                  {FiliterImageArray.map((data, index) => {
                    return (
                      <Image
                        key={data + index}
                        resizeMode="contain"
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                        source={{uri: data}}
                      />
                    );
                  })}
                </Swiper>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileImageViewScreen;
