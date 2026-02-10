import React, { useState } from "react"
import { View, Text, TextInput, Pressable, Alert, Modal } from "react-native"
import { forgotPassword } from "@/service/authService"
import { useLoader } from "@/hooks/useLoader"

interface ResetPasswordModalProps {
    visible: boolean;
    onClose: () => void;
}
const ForgetPassword: React.FC<ResetPasswordModalProps> = ({ visible, onClose }) => {
    const [email, setEmail] = useState("");
    const { showLoader, hideLoader, isLoading } = useLoader();

    const handleResetPassword = async () => {
        if (!email) {
            alert("Please enter your email");
            return;
        }
       
        try {
            showLoader();
            await forgotPassword(email);
            Alert.alert(
                "Success",
                "Password reset email sent! Check your inbox."
            );
        } catch (error: any) {
            alert(error.message || "Failed to send reset email");
        } finally {
            hideLoader();
        }
    }

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 justify-center items-center bg-white bg-opacity-50 p-6">
                <View className="w-full bg-blue-100 rounded-lg p-6">
                    <Text className="text-2xl font-bold mb-4 text-center">Reset Password</Text>
                    <TextInput
                        placeholder="Enter your email"
                        className="w-full p-3 border rounded-md mb-4"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Pressable
                        className="w-full bg-blue-600 p-3 rounded-md items-center mb-3"
                        onPress={handleResetPassword}
                        disabled={isLoading}
                    >
                        <Text className="text-white font-semibold">Send Reset Link</Text>
                    </Pressable>
                    <Pressable onPress={onClose} className="w-full items-center p-2">
                        <Text className="text-gray-500 font-semibold">Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

export default ForgetPassword
