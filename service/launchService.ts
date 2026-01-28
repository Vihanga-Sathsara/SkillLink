import AsyncStorage from '@react-native-async-storage/async-storage'

export const isFirstLaunch = async () => {
    const isFirstLaunch = await AsyncStorage.getItem('hasLaunchedBefore')
    return isFirstLaunch === null
}

export const setLaunched = async () => {
    await AsyncStorage.setItem('hasLaunchedBefore', 'true')
}   

export const removeLaunch = async () => {
    await AsyncStorage.removeItem('hasLaunchedBefore')
}