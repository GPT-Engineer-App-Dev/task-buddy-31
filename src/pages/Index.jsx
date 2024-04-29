import { useState } from 'react';
import { Box, Button, Input, List, ListItem, Checkbox, Text, Flex, Heading } from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  const handleAddTask = () => {
    if (input.trim() !== '') {
      const newTasks = [...tasks, { text: input, completed: false }];
      setTasks(newTasks);
      setInput('');
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleCompleteTask = (index) => {
    const newTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const handleEditTask = (index) => {
    setInput(tasks[index].text);
    setEditIndex(index);
  };

  const handleSaveEdit = () => {
    const newTasks = tasks.map((task, i) => {
      if (i === editIndex) {
        return { ...task, text: input };
      }
      return task;
    });
    setTasks(newTasks);
    setInput('');
    setEditIndex(-1);
  };

  return (
    <Box p={5}>
      <Heading mb={4}>Todo App</Heading>
      <Flex mb={4}>
        <Input placeholder="Add a new task" value={input} onChange={(e) => setInput(e.target.value)} />
        {editIndex === -1 ? (
          <Button onClick={handleAddTask} ml={2} colorScheme="blue"><FaPlus /></Button>
        ) : (
          <Button onClick={handleSaveEdit} ml={2} colorScheme="green"><FaEdit /></Button>
        )}
      </Flex>
      <List spacing={3}>
        {tasks.map((task, index) => (
          <ListItem key={index} d="flex" alignItems="center">
            <Checkbox isChecked={task.completed} onChange={() => handleCompleteTask(index)} mr={2} />
            <Text as={task.completed ? 'del' : undefined} flex="1">{task.text}</Text>
            <Button onClick={() => handleEditTask(index)} colorScheme="yellow" size="sm" mr={2}><FaEdit /></Button>
            <Button onClick={() => handleDeleteTask(index)} colorScheme="red" size="sm"><FaTrash /></Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Index;