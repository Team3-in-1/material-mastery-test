import axios from 'axios';
import { constant } from '@/utils/constant';
import { UserAttributesRequest, UserRequest } from '@/utils/request';
import queryClient from '@/helpers/client';
import { metadata } from '@/app/layout';



const login = async (request: FormData) => {
    await axios.post(`${constant.BASE_URL}/signIn`, request, {
        headers: {
            'x-api-key': constant.API_KEY
        }
    })
    .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data.metadata))
        return res.data
    })
    .catch(error => {throw new Error(error.response.data.message)})
}

const register = async (formData: any) => {

    //  name: (value) => checkNameFormat(value),
    //   phone: (value) => checkPhoneFormat(value),
    //   email: (value) => checkEmailFormat(value),
    //   password: (value) => checkPasswordFormat(value),

    const user: UserRequest = {
        username: formData.name,
        password: formData.password,
        email: formData.email,
        display_name: formData.name,
        phone: formData.phone,
        roles: ['customer'],
        user_attributes: {address: 'Thu duc'},
    }

    await axios.post(`${constant.BASE_URL}/signUp`, user, {
        headers: {
            'x-api-key': constant.API_KEY
        }
    })
    .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data.metadata))
        return res.data
    })
    .catch(error => {throw new Error(error.response.data.message)})
}

// const getUserById = async () : Promise<> => {

// }

const updateUser = async(user_id: string, token:string, username: string, email: string, phone: string, address: string): Promise<any> => {
    console.log('Update user infor')
    console.log('userID', user_id)
    console.log('token', token)
    console.log('username', username)
    console.log('email', email)
    console.log('phone', phone)
    console.log('address', address)
    
    return await axios.patch(`${constant.BASE_URL}/user/${user_id}`, {
        'username': username,
        'email': email,
        'phone': phone,
        "user_attributes": {
            "address": address
        }
    }, {
        headers: {
            'x-api-key': constant.API_KEY,
            'x-client-id': user_id,
            'authorization': token,
        }

    }).then(res=>{
        console.log('res.data.metadata: ', res.data.metadata)
        return res.data.metadata}).catch((error)=>error)
}



export const userService = {
    login,
    register,
    updateUser,
};
