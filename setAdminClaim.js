const admin = require("firebase-admin");

// 서비스 계정 키 JSON 경로
const serviceAccount = require("./serviceAccountKey.json");

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 수정할 이메일 입력
const targetEmail = "qmelo72@naver.com";

admin
  .auth()
  .getUserByEmail(targetEmail)
  .then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`✅ ${targetEmail} 사용자에게 admin 클레임이 부여되었습니다.`);
  })
  .catch((error) => {
    console.error("❌ 에러 발생:", error);
  });
