import { useNavigate } from 'react-router-dom';

import { HTTPErrorInfo } from '../../../api/utils/HTTPError';
import ErrorImage from '../../../assets/png/error-image.png';
import { PATH } from '../../../constants/path';
import Heading from '../Heading/Heading';
import ServerSelect from '../ServerSelect/ServerSelect';
import * as S from './Error.styles';

export interface ErrorProps {
  message: string;
  information?: HTTPErrorInfo['payload'];
  resetError: () => void;
}

const Error = ({ message, information, resetError }: ErrorProps) => {
  const navigate = useNavigate();

  const handleReload = () => {
    navigate(PATH.RELOAD);
  };

  return (
    <S.ErrorWrapper>
      <S.ErrorContentContainer>
        <S.ErrorImage src={ErrorImage} alt="error" />
        <Heading size="xSmall">{message}</Heading>
        {information?.BODY && <S.ErrorBodyText>{information.BODY}</S.ErrorBodyText>}
        <S.ErrorResetButton variant="primary" onClick={resetError}>
          {information?.BUTTON ?? '새로고침'}
        </S.ErrorResetButton>
        <ServerSelect onChange={handleReload} />
      </S.ErrorContentContainer>
    </S.ErrorWrapper>
  );
};

export default Error;
