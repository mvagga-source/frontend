import BootStrapBtn from "./BootStrapBtn";

/**
 * @component SaveBtn
 * @description 데이터를 서버에 전송하거나 저장할 때 사용하는 기본 버튼(기본 색상 Blue:primary)
 * @param {object} props - 리액트 기본 props 및 부트스트랩 속성
 * @param {React.ReactNode} [props.children='저장'] - 버튼 내부 텍스트 또는 요소
 * @example <SaveBtn onClick={handleSave} />
 */
export const SaveBtn = ({...props }) => {
    return (
        <BootStrapBtn 
            variant="sky"
            {...props}
        >
          {props.children?props.children:'저장'}
        </BootStrapBtn>
    );
};

/**
 * @component CancelBtn
 * @description 입력을 취소하거나 이전 화면으로 돌아갈 때 사용하는 버튼 (기본 색상 Gray:secondary)
 * @param {object} props - 리액트 기본 props 및 부트스트랩 속성
 * @param {React.ReactNode} [props.children='취소'] - 버튼 내부 텍스트 또는 요소
 */
export const CancelBtn = ({...props }) => (
    <BootStrapBtn variant="secondary" {...props}>
        {props.children?props.children:'취소'}
    </BootStrapBtn>
);

/**
 * @component EditBtn
 * @description 기존 데이터를 수정 모드로 전환할 때 사용하는 버튼 (기본 색상 Yellow:warning)
 * @param {object} props - 리액트 기본 props 및 부트스트랩 속성
 * @param {React.ReactNode} [props.children='수정'] - 버튼 내부 텍스트 또는 요소
 */
export const EditBtn = ({...props }) => (
    <BootStrapBtn variant="warning" {...props}>
        {props.children?props.children:'수정'}
    </BootStrapBtn>
);

/**
 * @component DelBtn
 * @description 데이터를 삭제할 때 사용하는 위험 알림 버튼 (기본 색상 Red:danger)
 * @param {object} props - 리액트 기본 props 및 부트스트랩 속성
 * @param {React.ReactNode} [props.children='삭제'] - 버튼 내부 텍스트 또는 요소
 */
export const DelBtn = ({...props }) => (
    <BootStrapBtn variant="danger" {...props}>
        {props.children?props.children:'삭제'}
    </BootStrapBtn>
);

export const NeonBtn = ({...props }) => (
    <div className="neon-board-container">
    <BootStrapBtn variant="neon" {...props}>
        {props.children?props.children:'검색'}
    </BootStrapBtn>
    </div>
);

export const MoveBtn = ({...props }) => (
    <BootStrapBtn variant="verify" {...props}>
        {props.children?props.children:'페이지'}
    </BootStrapBtn>
);

export const SearchBtn = ({...props }) => (
    <MoveBtn {...props}>
        {props.children?props.children:'검색'}
    </MoveBtn>
);

/**
 * @description default로 이벤트들 등록 후 나중에 props에서 onClick={undefined}로 이벤트 제거나 다른 이벤트로 교체 가능
 * 주로 해당 컴포넌트에 onClick이벤트들이 똑같이 자주 사용된다면 추가해도 됨
 * @example test/TestLogin.js에서 확인 및 테스트 가능
 */
export const TestBtn = ({ children = '저장', ...props }) => {
    const handleInternalClick = async (e) => {
        alert("test");
    };

    return (
        <BootStrapBtn 
            variant="primary"
            onClick={handleInternalClick}   //기본 Default이벤트
            // 만약 props로 전달된 onClick이 있다면 해당 이벤트 실행
            {...props}
        >
          {children}
        </BootStrapBtn>
    );
};