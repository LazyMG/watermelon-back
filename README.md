# 유튜브 뮤직 클론 코딩 프로젝트

본 프로젝트는 유튜브 뮤직 클론 코딩 프로젝트로, 풀스택 개발을 목표로 진행하였습니다. 현재 페이지는 프로젝트 중 백엔드 프로젝트의 설명을 담고 있습니다.

### 프로젝트 소개
프로젝트에 사용된 스킬입니다.
<br/>

![node](https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)
![express](https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white)
![mongodb](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white)
<br/>

자바스크립트를 사용하는 Node.js를 백엔드에 사용하여 러닝 커브를 줄이고자 하였습니다. DB는 MongoDB를 사용하였고 Mongoose 라이브러리를 사용하여 Node와 연결하였습니다.
프론트엔드 개발자로서 백엔드의 개발 과정을 체험해보고 소통 방식을 고려할 수 있는 프로젝트였습니다.
<br/>

### 프로젝트 일정
24.05.26 - 24.06.15 : 1차 배포 완료(80% 완성도, 기본 기능 동작)

### 문제 및 해결
#### 1. DB 모델 설계 및 구현
처음 DB 모델을 설계 했을 때 User, Music, Playlist까지 세 개의 모델이 필요하다고 생각했습니다. 하지만 직접 Music 모델의 데이터를 저장하려고 할 때 가수와 앨범의 정보도 DB에 담겨야한다는 것을 알았습니다. DB 설계 단계에서 모델끼리의 연결을 구체적으로 분석하지 못한 것이었습니다. 때문에 Artist, Album 모델을 추가하였습니다. 

모델을 추가함으로 또다른 문제가 생겼습니다. mongoose의 populate 함수로 데이터끼리 효율적으로 연결하고자 하였는데 엔드포인트 함수마다 populate 함수로 불러오는 데이터의 깊이가 달라 프론트에서 에러가 발생한 것입니다. 이를 수정하면서 데이터들끼리 복잡하게 연결되었을 때를 고려하여 각 엔드포인트 함수에서 불러오는 데이터의 형식을 명시적으로 정해놓아야 한다는 것을 깨달았습니다. 불필요하게 데이터를 불러오는 경우와 필요한 데이터를 불러오지 못하는 경우를 파악하여 수정하였습니다.

DB 설계 및 구현 과정을 통해 프론트엔드 개발자로서 전체 데이터의 구조와 필요한 데이터의 형식을 백엔드 개발자와 충분히 상의해야 한다는 것을 배웠습니다. 또 프로젝트 설계 단계에서 구체적으로 분석해야 하고 이후 과정에서 문제를 발견했다면 이에 따른 해결 과정 역시 부수효과를 고려하여 진행해야 한다는 것을 배울 수 있었습니다.

#### 2. 로그인 (백엔드 관점)
본 프로젝트에서 로그인은 `express-session` 라이브러리를 통해 구현하였습니다. 로컬스토리지나 세션스토리지에 로그인 정보를 저장하는 것은 비효율적이고 위험하다고 판단하여 DB에 세션을 저장할 수 있도록 하였습니다. 프론트와는 쿠키를 교환하여 세션에 로그인 정보를 저장할 수 있도록 하였습니다. 

문제는 배포 이후에 발생했습니다. 배포가 완료된 후 로그인 정보가 세션에 담기지 않았습니다. 문제를 파악해보니 서로 도메인이 다를 때 쿠키 통신이 불가하다는 것이었습니다. 처음 겪어보는 문제에 당황하여 문제를 파악하고 원인을 밝히는데 많은 시간을 들였습니다. 백엔드 서버 설정에서 cors 설정 및 쿠키, proxy 설정을 완료한 후에 해결할 수 있었습니다.

쿠키에 관한 문제를 겪으면서 보안에 대해 생각해보게 되었습니다. 현재 해결한 것이 임시방편이라 생각하고 보다 안전하고 효율적으로 쿠키를 교환할 수 있는 방식을 고민해보게 되었습니다.
<br/>

### 사용방법
서비스를 이용하기 위해서 백엔드 서버가 먼저 동작해야 합니다. 백엔드 서버 링크를 들어가 서버를 동작시킵니다.
<br/>
백엔드 프로젝트 배포 링크 : [https://watermelon-back-lmg.fly.dev/](https://watermelon-back-lmg.fly.dev/)
<br/>
그후 프론트엔드 배포 링크로 서비스를 이용합니다.


<br/>
프론트엔드 프로젝트 배포 링크 : [https://watermelon-lmg.netlify.app/](https://watermelon-lmg.netlify.app/)
<br/>

### 관련 링크
노션 계획표 : [https://precious-switch-692.notion.site/7b1dcd5713e64d61b1537b70c0bc5e46?pvs=4](https://precious-switch-692.notion.site/7b1dcd5713e64d61b1537b70c0bc5e46?pvs=4)<br/>
블로그 기록 : [https://velog.io/@cbfmark/series/%ED%86%A0%EC%9D%B4%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%9C%A0%ED%8A%9C%EB%B8%8C%EB%AE%A4%EC%A7%81](https://velog.io/@cbfmark/series/%ED%86%A0%EC%9D%B4%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%9C%A0%ED%8A%9C%EB%B8%8C%EB%AE%A4%EC%A7%81)

<<<<<<< HEAD
프로젝트에 사용된 스킬입니다.
<br/>

![node](https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)
![express](https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white)
![mongodb](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white)
<br/>

자바스크립트를 사용하는 Node.js를 백엔드에 사용하여 러닝 커브를 줄이고자 하였습니다. DB는 MongoDB를 사용하였고 Mongoose 라이브러리를 사용하여 Node와 연결하였습니다.
프론트엔드 개발자로서 백엔드의 개발 과정을 체험해보고 소통 방식을 고려할 수 있는 프로젝트였습니다.
<br/>

### 프로젝트 일정

24.05.26 - 24.06.15 : 1차 배포 완료(80% 완성도, 기본 기능 동작)

### 문제 및 해결

#### 1. DB 모델 설계 및 구현

처음 DB 모델을 설계 했을 때 User, Music, Playlist까지 세 개의 모델이 필요하다고 생각했습니다. 하지만 직접 Music 모델의 데이터를 저장하려고 할 때 가수와 앨범의 정보도 DB에 담겨야한다는 것을 알았습니다. DB 설계 단계에서 모델끼리의 연결을 구체적으로 분석하지 못한 것이었습니다. 때문에 Artist, Album 모델을 추가하였습니다.

모델을 추가함으로 또다른 문제가 생겼습니다. mongoose의 populate 함수로 데이터끼리 효율적으로 연결하고자 하였는데 엔드포인트 함수마다 populate 함수로 불러오는 데이터의 깊이가 달라 프론트에서 에러가 발생한 것입니다. 이를 수정하면서 데이터들끼리 복잡하게 연결되었을 때를 고려하여 각 엔드포인트 함수에서 불러오는 데이터의 형식을 명시적으로 정해놓아야 한다는 것을 깨달았습니다. 불필요하게 데이터를 불러오는 경우와 필요한 데이터를 불러오지 못하는 경우를 파악하여 수정하였습니다.

DB 설계 및 구현 과정을 통해 프론트엔드 개발자로서 전체 데이터의 구조와 필요한 데이터의 형식을 백엔드 개발자와 충분히 상의해야 한다는 것을 배웠습니다. 또 프로젝트 설계 단계에서 구체적으로 분석해야 하고 이후 과정에서 문제를 발견했다면 이에 따른 해결 과정 역시 부수효과를 고려하여 진행해야 한다는 것을 배울 수 있었습니다.

#### 2. 로그인 (백엔드 관점)

본 프로젝트에서 로그인은 `express-session` 라이브러리를 통해 구현하였습니다. 로컬스토리지나 세션스토리지에 로그인 정보를 저장하는 것은 비효율적이고 위험하다고 판단하여 DB에 세션을 저장할 수 있도록 하였습니다. 프론트와는 쿠키를 교환하여 세션에 로그인 정보를 저장할 수 있도록 하였습니다.

문제는 배포 이후에 발생했습니다. 배포가 완료된 후 로그인 정보가 세션에 담기지 않았습니다. 문제를 파악해보니 서로 도메인이 다를 때 쿠키 통신이 불가하다는 것이었습니다. 처음 겪어보는 문제에 당황하여 문제를 파악하고 원인을 밝히는데 많은 시간을 들였습니다. 백엔드 서버 설정에서 cors 설정 및 쿠키, proxy 설정을 완료한 후에 해결할 수 있었습니다.

쿠키에 관한 문제를 겪으면서 보안에 대해 생각해보게 되었습니다. 현재 해결한 것이 임시방편이라 생각하고 보다 안전하고 효율적으로 쿠키를 교환할 수 있는 방식을 고민해보게 되었습니다.
<br/>

### 사용방법

서비스를 이용하기 위해서 백엔드 서버가 먼저 동작해야 합니다. 백엔드 서버 링크를 들어가 서버를 동작시킵니다.
<br/>
백엔드 프로젝트 배포 링크 : [https://watermelon-back-lmg.fly.dev/](https://watermelon-back-lmg.fly.dev/)
<br/>
그후 프론트엔드 배포 링크로 서비스를 이용합니다.
<br/>
프론트엔드 프로젝트 배포 링크 : [https://watermelon-lmg.netlify.app/](https://watermelon-lmg.netlify.app/)
<br/>

### 관련 링크

노션 계획표 : [https://precious-switch-692.notion.site/7b1dcd5713e64d61b1537b70c0bc5e46?pvs=4](https://precious-switch-692.notion.site/7b1dcd5713e64d61b1537b70c0bc5e46?pvs=4)<br/>
블로그 기록 : [https://velog.io/@cbfmark/series/%ED%86%A0%EC%9D%B4%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%9C%A0%ED%8A%9C%EB%B8%8C%EB%AE%A4%EC%A7%81](https://velog.io/@cbfmark/series/%ED%86%A0%EC%9D%B4%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%9C%A0%ED%8A%9C%EB%B8%8C%EB%AE%A4%EC%A7%81)
=======
>>>>>>> 51ba8b9ee3e226fa99200ab17e2a17a70c2c45e3
