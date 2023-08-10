import RNIap, {
  type PurchaseError,
  finishTransaction,
  type SubscriptionPurchase,
} from 'react-native-iap';
import {Platform, Alert} from 'react-native';
import {useEffect, useState} from 'react';

const itemSubs: any = Platform.select({
  ios: [
    // ios_monthly_subs_id,
    // ios_yearly_subs_id
  ],
  android: [
    // aos_monthly_subs_id,
    // aos_yearly_subs_id
  ],
});

function SubScriptionScreen() {
  let purchaseUpdateSubscription: any;
  let purchaseErrorSubscription: any;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const connection = async () => {
      try {
        const init = await RNIap.initConnection();
        const initCompleted = init === true;

        if (initCompleted) {
          if (Platform.OS === 'android') {
            await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
          } else {
            await RNIap.clearTransactionIOS();
          }
        }

        // 구독 결제를 성공적으로 한 경우
        purchaseUpdateSubscription = purchaseUpdateSubscription(
          async (purchase: SubscriptionPurchase) => {
            const receipt = purchase.transactionReceipt
              ? purchase.transactionReceipt
              : purchase.purchaseToken;

            if (receipt) {
              try {
                setLoading(false);
                const ackResult = await finishTransaction(purchase);

                // 구매이력 저장 및 상태 갱신
                if (purchase) {
                }
              } catch (error) {
                console.log('ackError: ', error);
              }
            }
          },
        );

        purchaseErrorSubscription = purchaseErrorSubscription(
          (error: PurchaseError) => {
            setLoading(false);

            // 정상적인 에러상황 대응
            const USER_CANCEL = 'E_USER_CANCELED';
            if (error && error.code === USER_CANCEL) {
              Alert.alert('구매 취소', '구매를 취소하셨습니다.');
            } else {
              Alert.alert('구매 실패', '구매 중 오류가 발생하였습니다.');
            }
          },
        );

        getSubscriptions();
      } catch (error) {
        console.log('connection error: ', error);
      }
    };

    connection();

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }

      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }

      RNIap.endConnection();
    };
  }, []);
}

const getSubscriptions = async () => {
  try {
    const subscriptions = await RNIap.getSubscriptions(itemSubs);
    // subscriptions 저장
  } catch (error) {
    console.log('get subscriptions error: ', error);
  }
};

const requestSubscriptionPurchase = async (sub: any) => {
  try {
    RNIap.requestSubscription(sub);
  } catch (error: Error) {
    console.log('request purchase error: ', error);
    Alert.alert(error.message);
  }
};

export {getSubscriptions, requestSubscriptionPurchase};
