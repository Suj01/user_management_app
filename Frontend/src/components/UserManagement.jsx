import { useState, useEffect, useRef } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex,
    Button,
    Checkbox,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Spinner,
} from '@chakra-ui/react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '' });
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const cancelRef = useRef();
    const toast = useToast();

    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("https://user-management-app-qpsf.onrender.com/user/get");
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.allUsers)) {
                    setUsers(data.allUsers);
                } else {
                    console.error('Unexpected response format:', data);
                }
            } else {
                console.error('Error fetching users:', res.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleAddUser = async () => {
        try {
            const response = await fetch('https://user-management-app-qpsf.onrender.com/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                fetchUser();
                setNewUser({ firstName: '', lastName: '', email: '' });
                onClose();
                toast({
                    title: 'User added.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Failed to add user.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`https://user-management-app-qpsf.onrender.com/user/delete/${selectedUser}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchUser();
                onAlertClose();
                toast({
                    title: 'User deleted.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Failed to delete user.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    

    return (
        <>
            <Flex justifyContent="end" alignItems="center" gap={10} p={2} mt={4} mr={5}>
                <Button colorScheme='teal' size='lg' onClick={onOpen}>
                    Sign Up
                </Button>
                <Button
                    colorScheme='teal'
                    size='lg'
                    isDisabled={ users.length === 0}
                >
                    Export
                </Button>
            </Flex>
            <TableContainer mt={5} p={4} borderRadius="md" boxShadow="md">
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Check</Th>
                            <Th>First Name</Th>
                            <Th>Last Name</Th>
                            <Th>Email</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {isLoading ? (
                            <Tr>
                                <Td colSpan="5" textAlign="center">
                                    <Spinner size="lg" />
                                </Td>
                            </Tr>
                        ) : users.length > 0 ? (
                            users.map(user => (
                                <Tr key={user._id}>
                                    <Td>
                                        <Checkbox
                                            isChecked={selectedUsers.includes(user._id)}
                                            onChange={() => handleSelectUser(user._id)}
                                        />
                                    </Td>
                                    <Td>{user.firstName}</Td>
                                    <Td>{user.lastName}</Td>
                                    <Td>{user.email}</Td>
                                    <Td>
                                        <Text
                                            color="red.500"
                                            cursor="pointer"
                                            onClick={() => {
                                                setSelectedUser(user._id);
                                                onAlertOpen();
                                            }}
                                        >
                                            DELETE
                                        </Text>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan="5" textAlign="center">
                                    No users found
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            placeholder='First Name'
                            value={newUser.firstName}
                            onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                            mb={3}
                        />
                        <Input
                            placeholder='Last Name'
                            value={newUser.lastName}
                            onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                            mb={3}
                        />
                        <Input
                            placeholder='Email'
                            value={newUser.email}
                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleAddUser}>
                            Save
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete User
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onAlertClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteUser} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default UserManagement;
