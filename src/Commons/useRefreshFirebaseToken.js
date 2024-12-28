import { auth } from "../firebaseConfig";

const useRefreshFirebaseToken = async () => {
    try {
        return new Promise(function (resolve, reject) {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    let signedInIdToken = await auth.currentUser.getIdToken(
                        /* forceRefresh */ false,
                    );
                    console.log("signedInIdToken refresh ", userData?.phone, signedInIdToken, typeof signedInIdToken);
                    // localStorage.setItem('user', JSON.stringify({ ...userData, firebaseIdToken: signedInIdToken }));
                    localStorage.setItem('afFirebaseIdToken', signedInIdToken);
                    resolve(signedInIdToken);
                    // userData['firebaseIdToken'] = signedInIdToken;
                }
            });
        });
    } catch (e) {
        console.log("signedInIdToken refresh error ", e);
        return null
    }

    // dispatch(setUserData({ ...userData }));
}