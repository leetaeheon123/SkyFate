import {WithLocalSvg} from 'react-native-svg';
import CompleteAttend from 'Assets/CompleteAttend.svg';
import AlreadyAttend from 'Assets/AlreadyAttend.svg';
// import FirstEventPoster from 'Assets/FirstEvent/FirstEventPoster.svg';
import Good from 'Assets/Good.svg';
export const CompleteAttendFirstEventSvg = (width) => {
  return (
    <WithLocalSvg
      asset={CompleteAttend}
      width={width}
      // height={width * 0.81}
    />
  );
};

export const GoodSvg = (width) => {
  return (
    <WithLocalSvg
      asset={Good}
      style={{
        zIndex: 2,
        position: 'absolute',
      }}
      // height={width * 0.81}
    />
  );
};

export const AlreadyAttendFirstEventSvg = (width) => {
  return <WithLocalSvg asset={AlreadyAttend} width={width} />;
};

// export const FirstEventPosterSvg = (width) => {
//   return <WithLocalSvg asset={FirstEventPoster} width={width} />;
// };
