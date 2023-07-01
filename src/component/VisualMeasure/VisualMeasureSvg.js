import {WithLocalSvg} from 'react-native-svg';

import Congratulate from 'Assets/Chat/Congratulate.svg';

import VisualMeasureStart1 from 'Assets/VisualMeasure/VisualMeasureStart1.svg';
import VisualMeasureStart2 from 'Assets/VisualMeasure/VisualMeasureStart2.svg';

import VisualMeasureInProgress from 'Assets/VisualMeasure/VisualMeasureInProgress.svg';
import VisualMeasureSuccess from 'Assets/VisualMeasure/VisualMeasureSuccess.svg';
import VisualMeasureFailed from 'Assets/VisualMeasure/VisualMeasureFailed.svg';

export const VisualMeasureStart1Svg = ({width, height}) => (
  <WithLocalSvg asset={VisualMeasureStart1} width={width} height={height} />
);

export const VisualMeasureStart2Svg = ({width, height}) => (
  <WithLocalSvg asset={VisualMeasureStart2} width={width} height={height} />
);

export const VisualMeasureInProgressSvg = ({width, height}) => (
  <WithLocalSvg asset={VisualMeasureInProgress} width={width} height={height} />
);
export const VisualMeasureSuccessSvg = ({width, height}) => (
  <WithLocalSvg asset={VisualMeasureSuccess} width={width} height={height} />
);

export const VisualMeasureFailedSvg = ({width, height}) => (
  <WithLocalSvg asset={VisualMeasureFailed} width={width} height={height} />
);
