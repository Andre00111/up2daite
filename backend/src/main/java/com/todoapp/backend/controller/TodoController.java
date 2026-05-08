package com.todoapp.backend.controller;

import com.todoapp.backend.dto.CreateTodoRequest;
import com.todoapp.backend.dto.TodoDto;
import com.todoapp.backend.dto.UpdateTodoRequest;
import com.todoapp.backend.entity.Todo;
import com.todoapp.backend.repository.TodoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<TodoDto> getAllTodos(@RequestParam(required = false) Boolean completed) {
        List<Todo> todos;
        if (completed != null) {
            todos = todoRepository.findByCompletedOrderByCreatedAtDesc(completed);
        } else {
            todos = todoRepository.findAllByOrderByCreatedAtDesc();
        }
        return todos.stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoDto> getTodoById(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(todo -> ResponseEntity.ok(toDto(todo)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TodoDto createTodo(@Valid @RequestBody CreateTodoRequest request) {
        Todo todo = new Todo();
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        return toDto(todoRepository.save(todo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoDto> updateTodo(@PathVariable Long id, @RequestBody UpdateTodoRequest request) {
        return todoRepository.findById(id)
                .map(todo -> {
                    if (request.title() != null) {
                        todo.setTitle(request.title());
                    }
                    if (request.description() != null) {
                        todo.setDescription(request.description());
                    }
                    if (request.completed() != null) {
                        todo.setCompleted(request.completed());
                    }
                    return ResponseEntity.ok(toDto(todoRepository.save(todo)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private TodoDto toDto(Todo todo) {
        return new TodoDto(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }
}
