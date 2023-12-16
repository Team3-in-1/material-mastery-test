'use client';

import {
  Stack,
  Group,
  Image,
  Button,
  TextInput,
  Text,
  Flex,
  LoadingOverlay,
  Modal,
  Input,
  Textarea,
} from '@mantine/core';
// import '@mantine/core/styles.layer.css';
// import '@mantine/carousel/styles.layer.css';
// import '@mantine/dates/styles.css';
import '../../../global.css';
import NextImage from 'next/image';
import { useDisclosure } from '@mantine/hooks';

import defaultAvatar from '@/public/pic/Avatar.png';
import queryClient from '@/helpers/client';
import { useRouter } from 'next/navigation';
import { IconMapPinFilled } from '@tabler/icons-react';
import { useContext, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import {
  checkAddressFormat,
  checkEmailFormat,
  checkNameFormat,
  checkPhoneFormat,
} from '@/utils/regex';
import { userService } from '@/services/userService';
import UserContext from '@/contexts/UserContext';

const DetailsPage = () => {
  const { user } = useContext(UserContext);

  const userInfor = useQuery({
    queryKey: ['userInfor'],
    queryFn: () => {
      return userService.getUserById(user);
    },
    enabled: !!user,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<any>(null);
  const [avatarInput, setAvatarInput] = useState<any>(null);
  const [email, setEmail] = useState('');

  const [enableBox1, setEnableBox1] = useState(false);
  const [enableBox2, setEnableBox2] = useState(false);

  // store initial value
  const isSet = useRef(false);
  let initialName = useRef('');
  let initialEmail = useRef('');
  let initialPhone = useRef('');
  let initialAddress = useRef('');
  let initialImage = useRef(null);

  if (!isSet.current && userInfor.isSuccess) {
    initialName.current = userInfor.data.display_name;
    initialEmail.current = userInfor.data.email;
    initialPhone.current = userInfor.data.phone;
    initialAddress.current = userInfor.data.user_attributes.address;
    initialImage.current = userInfor.data.user_attributes.avatar
      ? userInfor.data.user_attributes.avatar
      : 'https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/289149087_532680565185439_2587124243099315687_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=9c7eae&_nc_eui2=AeHlj-MAcPCkW6Sd1ZZINLX3dnM5XV8os_B2czldXyiz8DYpOp_w7W8fpY4T3y3bu4Av1LeBPAcSUXou-hH6qBbe&_nc_ohc=NLO3EECZx1QAX_XqSm2&_nc_ht=scontent.fsgn2-8.fna&oh=00_AfBz6S6rudC72TW0LONnocrZQ4cIsc4UNFHt9IKBOmWiuw&oe=657B1067';
    setName(initialName.current);
    setPhone(initialPhone.current);
    setAddress(initialAddress.current);
    setAvatar(initialImage.current);
    setAvatarInput(initialImage.current);
    setEmail(initialEmail.current);

    isSet.current = true;
  }

  const returnInitialValue = (type: number) => {
    if (type == 0) {
      setName(initialName.current);
      setPhone(initialPhone.current);
    } else setAddress(initialAddress.current);
  };

  const userId = user?.userId;

  const token = user?.accessToken;
  const [opened, { open, close }] = useDisclosure(false);

  const userMutation = useMutation({
    mutationKey: ['update-user'],
    mutationFn: () =>
      userService.updateUser(userId, token, name, phone, address, avatar),
    onSuccess: async (res) => {
      toast.success('Cập nhập thành công');
      await queryClient.refetchQueries({
        queryKey: ['userInfor'],
        type: 'active',
        exact: true,
      });
    },
    onError: (err) => {
      toast.error('Cập nhập thất bại.');
      console.log('err: ', err);
    },
    retry: 3,
  });

  const updateClick = async () => {
    const a = await userMutation.mutateAsync();
  };

  return (
    <Stack className='w-full h-full px-[100px]'>
      <Modal opened={opened} onClose={close} centered>
        <Stack>
          <Stack>
            <Text>Đường dẫn avatar: </Text>
            <Input
              value={avatarInput}
              onChange={(event) => {
                setAvatarInput(event.target.value);
              }}
            />
          </Stack>
          <Group className='w-full justify-evenly'>
            <Button
              className=' h-5 text-[#02B1AB] bg-transparent border-0'
              onClick={() => {
                if (avatarInput != '') {
                  setAvatar(avatarInput);
                  updateClick();
                  close();
                } else {
                  toast.error('Đường dẫn không thể để trống.');
                }
              }}
            >
              Lưu
            </Button>
            <Button
              className=' h-5 text-[#02B1AB] bg-transparent border-0'
              onClick={() => {
                setAvatarInput('');
                close();
              }}
            >
              Hủy
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Group>
        <Stack align='center' justify='center' className='flex-[1]'>
          <div className='w-[140px] h-[140px] rounded-full flex items-center justify-center'>
            <Image
              alt='avatar'
              h={120}
              w='auto'
              fit='contain'
              className='rounded-full '
              src={avatar}
            />
          </div>

          <Button
            className=' h-[25px] w-[120px] bg-transparent text-[#02B1AB] font-light border-[1.5px] border-[#02B1AB] rounded-[5px]'
            onClick={() => {
              open();
            }}
          >
            Thay đổi
          </Button>
        </Stack>
        <Stack className='flex-[2] bg-white rounded-[10px] p-[20px] box-content'>
          <Flex className=' w-full flex-row-reverse'>
            {enableBox1 && (
              <Button
                className=' h-5 text-[#02B1AB] bg-transparent border-0'
                //style={{ height: '1.25rem', color: '#02B1AB' }}
                onClick={() => {
                  returnInitialValue(0);
                  setEnableBox1(!enableBox1);
                }}
              >
                Hủy
              </Button>
            )}
            <Button
              className=' h-5 text-[#02B1AB] bg-transparent border-0'
              onClick={() => {
                if (enableBox1) {
                  // input valid check function will return null
                  if (checkNameFormat(name)) {
                    toast.error('Tên không hợp lệ');
                    returnInitialValue(0);
                  } else if (checkPhoneFormat(phone)) {
                    returnInitialValue(0);
                    toast.error('Số điện thoại không hợp lệ');
                  } else {
                    updateClick();
                  }
                }
                setEnableBox1(!enableBox1);
              }}
            >
              {enableBox1 ? 'Lưu' : 'Thay đổi'}
            </Button>
          </Flex>
          <TextInput
            withAsterisk
            label={'Tên'}
            value={name}
            disabled={!enableBox1}
            onChange={(event) => {
              setName(event.currentTarget.value);
            }}
          />
          <TextInput
            withAsterisk
            label={'Email'}
            value={email}
            disabled={true}
          />
          <TextInput
            withAsterisk
            label={'Số điện thoại'}
            value={phone}
            disabled={!enableBox1}
            onChange={(event) => {
              setPhone(event.currentTarget.value);
            }}
          />
        </Stack>
      </Group>
      <Stack className=' p-[20px] bg-white rounded-[10px]'>
        <Group className=' justify-between w-full'>
          <Group className='gap-2'>
            <IconMapPinFilled style={{ color: '#02B1AB' }} />
            <Text className='text-[#02B1AB] font-bold'>Địa chỉ</Text>
          </Group>
          <Group className='gap-0'>
            <Button
              onClick={() => {
                if (enableBox2) {
                  // input valid check function will return null
                  if (checkAddressFormat(address)) {
                    toast.error('Địa chỉ không hợp lệ');
                    returnInitialValue(1);
                  } else {
                    updateClick();
                  }
                }
                setEnableBox2(!enableBox2);
              }}
              // sua cho nay
              className=' h-5 cursor-pointer text-[#02B1AB] bg-transparent border-0'
            >
              {enableBox2 ? 'Lưu' : 'Thay đổi'}
            </Button>
            {enableBox2 && (
              <Button
                onClick={() => {
                  returnInitialValue(1);
                  setEnableBox2(!enableBox2);
                }}
                className=' h-5 text-[#02B1AB] bg-transparent border-0'
              >
                Hủy
              </Button>
            )}
          </Group>
        </Group>
        <Textarea
          withAsterisk
          disabled={!enableBox2}
          value={address}
          onChange={(event) => {
            setAddress(event.currentTarget.value);
          }}
        />
      </Stack>
      {userInfor.isPending && (
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      )}
    </Stack>
  );
};

// export default dynamic(() => Promise.resolve(DetailsPage), { ssr: false });
export default DetailsPage;
