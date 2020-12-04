import React, { createContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import api from '../services/api';

interface Task {
  id: string;
  title: string;
  finished: boolean;
}

interface TasksData {
  tasks: Task[];
  addTask(title: string): void;
  removeTask(id: string): void;
  findTask(id: string): void;
  changeStatus(id: string): void;
}

type AddTask = (title: string) => void;
type RemoveTask = (id: string) => void;
type FindTask = (id: string) => void;
type ChangeStatus = (id: string) => void;

export const TaskListContext = createContext<TasksData>({} as TasksData);

export const TaskListContextProvider: React.FC = ({ children }) => {
  const [tasks, setTasks] = useState([
    { id: uuid(), title: 'Lavar a louça', finished: true },
    { id: uuid(), title: 'Tirar o lixo', finished: false },
    { id: uuid(), title: 'Limpar a casa', finished: false },
  ]);

  const [editTassk, setEditTask] = useState({
    id: uuid(),
    title: '',
    finished: false,
  });

  useEffect(() => {
    async function loadTasks(): Promise<void> {
      const response = await api.get('/todos');
      setTasks(response.data);
      console.log(response.data);
    }

    loadTasks();
  }, []);

  const addTask: AddTask = useCallback(async (title: string) => {
    const newTasks = [...tasks, { id: uuid(), title, finished: false }];
    setTasks(newTasks);
    console.log(newTasks);
  }, [tasks]);

  const removeTask: RemoveTask = useCallback(async (id: string) => {
    const newTasks = [...tasks].filter((task) => task.id !== id);
    setTasks(newTasks);
  }, [tasks]);

  const findTask: FindTask = useCallback(async (id: string) => {
    const foundTask = [...tasks].find((task) => task.id === id);
    const editedTask = foundTask?.title;
    // setEditTask(foundTask);
    console.log(foundTask, editedTask);
  }, [tasks]);

  const changeStatus: ChangeStatus = useCallback(async (id: string) => {
    const newStatus = [...tasks].map((task) => (task.id === id
      ? { title: task.title, id: task.id, finished: true }
      : { title: task.title, id: task.id, finished: false }));
    setTasks(newStatus);
  }, [tasks]);

  return (
    <TaskListContext.Provider value={{ tasks, addTask, removeTask, findTask, changeStatus }}>
      {children}
    </TaskListContext.Provider>
  );
};