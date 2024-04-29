import { useState, useEffect } from 'react';
import { Box, Button, Input, List, ListItem, Checkbox, Text, Flex, Heading } from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { client } from 'lib/crud';

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const loadTasks = async () => {
      const loadedTasks = await client.getWithPrefix('task:');
      if (loadedTasks) {
        setTasks(loadedTasks.map(item => item.value));
      }
    };
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    if (input.trim() !== '') {
      const newTask = { text: input, completed: false, createdAt: new Date().toISOString() };
      await client.set(`task:${newTask.createdAt}`, newTask);
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      setInput('');
    }
  };

  const handleDeleteTask = async (index) => {
    const key = `task:${tasks[index].createdAt}`;
    await client.delete(key);
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleCompleteTask = async (index) => {
    const task = tasks[index];
    const updatedTask = { ...task, completed: !task.completed };
    await client.set(`task:${task.createdAt}`, updatedTask);
    const newTasks = tasks.map((t, i) => (i === index ? updatedTask : t));
    setTasks(newTasks);
  };

  const handleEditTask = (index) => {
    setInput(tasks[index].text);
    setEditIndex(index);
  };

  const handleSaveEdit = async () => {
    const updatedTask = { ...tasks[editIndex], text: input };
    await client.set(`task:${tasks[editIndex].createdAt}`, updatedTask, true);
    const newTasks = tasks.map((task, i) => (i === editIndex ? updatedTask : task));
    setTasks(newTasks);
    setInput('');
    setEditIndex(-1);
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Todo App</Heading>
      <Flex mb={6} direction={{ base: "column", md: "row" }} align="center">
        <Input placeholder="Add a new task" value={input} onChange={(e) => setInput(e.target.value)} />
        {editIndex === -1 ? (
          <Button onClick={handleAddTask} ml={2} colorScheme="blue" width={{ base: "full", md: "auto" }}><FaPlus /></Button>
        ) : (
          <Button onClick={handleSaveEdit} ml={2} colorScheme="green" width={{ base: "full", md: "auto" }}><FaEdit /></Button>
        )}
      </Flex>
      <List spacing={4}>
        {tasks.map((task, index) => (
          <ListItem key={index} display={{ base: "block", md: "flex" }} alignItems="center">
            <Checkbox isChecked={task.completed} onChange={() => handleCompleteTask(index)} mr={2} />
            <Text fontSize="lg" as={task.completed ? 'del' : undefined} flex="1" mb={{ base: 2, md: 0 }}>{task.text}</Text>
            <Button onClick={() => handleEditTask(index)} colorScheme="yellow" size="sm" mr={2}><FaEdit /></Button>
            <Button onClick={() => handleDeleteTask(index)} colorScheme="red" size="sm"><FaTrash /></Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Index;