import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './AuthContext';
import { SplashScreen } from './SplashScreen';
import { HomeScreen } from './HomeScreen';
import { SignInScreen } from './SignInScreen';
import { cos } from 'react-native-reanimated';

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = setReducers();
  setEffects();
  const authContext = setAuthContext();

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
                // User is signed in
                <Stack.Screen name="Home" component={HomeScreen} />
              )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );

  function setAuthContext() {
    return React.useMemo(
      () => ({
        signIn: async (data) => {
          dispatch({ type: 'SIGN_IN', token: 'fake-token', username: data.username });
        },
        signOut: () => dispatch({ type: 'SIGN_OUT' }),
        signUp: async (data) => {
          dispatch({ type: 'SIGN_IN', token: 'fake-token' });
        },
      }),
      []
    );
  }

  function setEffects() {
    React.useEffect(() => {
      const bootstrapAsync = async () => {
        let userToken;

        try {
          userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
          // Restoring token failed
        }

        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      };

      bootstrapAsync();
    }, []);
  }

  function setReducers() {
    return React.useReducer(
      (prevState, action) => {
        switch (action.type) {
          case 'RESTORE_TOKEN':
            return {
              ...prevState,
              userToken: action.token,
              username: action.username,
              isLoading: false,
            };
          case 'SIGN_IN':
            return {
              ...prevState,
              isSignout: false,
              userToken: action.token,
              username: action.username
            };
          case 'SIGN_OUT':
            return {
              ...prevState,
              isSignout: true,
              userToken: null,
              username: null
            };
        }
      },
      {
        isLoading: true,
        isSignout: false,
        userToken: null,
        username: null,
      }
    );
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}