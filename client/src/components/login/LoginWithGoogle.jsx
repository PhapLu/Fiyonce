import {GoogleLogin} from 'react-google-login';

const clientId = "987232593501-vrku3s2785r0p6pa86trvg0kvih0nbia.apps.googleusercontent.com"

export default function LoginWithGoogle() {
    
    return (
        <GoogleLogin
            clientId={clientId}
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
    )
}