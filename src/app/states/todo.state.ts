import {State, Action, StateContext, Selector} from '@ngxs/store';
import {Todo} from '../models/Todo';
import {AddTodo, DeleteTodo, GetTodos, SetSelectedTodo, UpdateTodo} from '../actions/todo.action';
import {TodoService} from '../todo.service';
import {tap} from 'rxjs/operators';

export class TodoStateModel {
    todos: Todo[];
    selectedTodo: Todo;
}

@State<TodoStateModel>({
    name: 'todos',
    defaults: {
        todos: [],
        selectedTodo: null
    }
})
export class TodoState {

    constructor(private todoService: TodoService) {
    }

    @Selector()
    static getTodoList(state: TodoStateModel) {
        return state.todos;
    }

    @Selector()
    static getSelectedTodo(state: TodoStateModel) {
        return state.selectedTodo;
    }

    @Action(GetTodos)
    getTodos({getState, setState}: StateContext<TodoStateModel>) {
        return this.todoService.fetchTodos().pipe(tap((result) => {
            const state = getState();
            setState({
                ...state,
                todos: result,
            });
        }));
    }

    @Action(DeleteTodo)
    deleteTodo({getState, setState}: StateContext<TodoStateModel>, { id }: DeleteTodo) {
        return this.todoService.deleteTodo(id).pipe(tap(() => {
            const state = getState();
            const filteredArray = state.todos.filter(item => item.id !== id);
            setState({
              ...state,
              todos: filteredArray
            });
        }));
    }

}
