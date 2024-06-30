import { useEffect, useState } from 'react';
import axiosClient from '../../../utils/axios';
import Header from '../../common/Header';
import { NavLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { UpdateUserAuthorityData, UserType } from '../../../types/score';
import { Controller, useForm } from 'react-hook-form';

const AdminUser = () => {
  const { control, handleSubmit, register } = useForm<UpdateUserAuthorityData>();
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}/user/list`);
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (users: UpdateUserAuthorityData) => {
    try {
      const response = await axiosClient.patch(`${import.meta.env.VITE_APP_URL}/user/change-authority`, {
        ...users,
      });
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex-grow container mx-auto px-4 py-8'>
          <div className='flex space-x-4 mb-6'>
            <NavLink to={'/'}>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                トップページへ
              </Typography>
            </NavLink>
            <NavLink to={'/admin'}>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                管理者トップページへ
              </Typography>
            </NavLink>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '50px' }}>ID</TableCell>
                    <TableCell>名前</TableCell>
                    <TableCell>メールアドレス</TableCell>
                    <TableCell>権限</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, idx) => (
                    <TableRow key={idx + 1}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-4'>
                          {user.name}
                          <Avatar className='mx-3' alt={user.name} src={user.imageUrl} />
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Controller
                          name={`users.${idx}.authority` as const}
                          control={control}
                          defaultValue={user.authority}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id={`user-authority-${user.id}`}>権限</InputLabel>
                              <Select labelId={`user-authority-${user.id}`} {...field} label='権限'>
                                <MenuItem value={'ADMIN'}>管理者</MenuItem>
                                <MenuItem value={'GUEST'}>ゲスト</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                        <input type='hidden' value={user.id} {...register(`users.${idx}.id`)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button type='submit' className='my-2' variant='contained'>
              更新
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminUser;
