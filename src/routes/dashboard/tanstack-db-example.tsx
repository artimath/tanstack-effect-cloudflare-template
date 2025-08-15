import { eq } from '@tanstack/db';
import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection, useLiveQuery } from '@tanstack/react-db';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/lib/trpc/react';

export const Route = createFileRoute('/dashboard/tanstack-db-example')({
  component: RouteComponent,
});

// Todo type based on Drizzle schema
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function RouteComponent() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <TanStackDBTodosRoute />
    </div>
  );
}

function TanStackDBTodosRoute() {
  const [newTodoText, setNewTodoText] = useState('');
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const todos = useQuery({ ...trpc.todo.getAll.queryOptions(), enabled: false });

  // Create TanStack DB collection using queryCollectionOptions
  const todoCollection = createCollection(
    queryCollectionOptions({
      queryKey: ['todos'],
      queryFn: async () => {
        const data = await todos.refetch();
        return data.data;
      },
      queryClient,
      getKey: (item) => item.id,
    })
  );

  // Standard tRPC mutations for server communication (matching original pattern)
  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        setNewTodoText('');
      },
    })
  );

  const toggleMutation = useMutation(
    trpc.todo.toggle.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.todo.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      },
    })
  );

  // Live query for all todos
  const { data: allTodos, isLoading, isError } = useLiveQuery((q) => q.from({ todo: todoCollection }));

  // Live query for completed todos only
  const { data: completedTodos } = useLiveQuery((q) =>
    q
      .from({ todo: todoCollection })
      .where(({ todo }) => eq(todo.completed, true))
      .select(({ todo }) => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
      }))
  );

  // Live query for pending todos only
  const { data: pendingTodos } = useLiveQuery((q) =>
    q
      .from({ todo: todoCollection })
      .where(({ todo }) => eq(todo.completed, false))
      .select(({ todo }) => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
      }))
  );

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      // Send to server (setNewTodoText will be called in onSuccess)
      await createMutation.mutateAsync({ text: newTodoText });
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    // Send to server
    await toggleMutation.mutateAsync({ id, completed: !completed });
  };

  const handleDeleteTodo = async (id: number) => {
    // Send to server
    await deleteMutation.mutateAsync({ id });
  };

  if (isError) {
    return (
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
          <CardDescription>Failed to load todos</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 py-10">
      <div className="text-center">
        <h1 className="font-bold text-3xl">TanStack DB Example</h1>
        <p className="mt-2 text-muted-foreground">Reactive todos with live queries and TanStack Query integration</p>
      </div>

      {/* Add Todo Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
          <CardDescription>Create a new task and see live query updates</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex items-center space-x-2" onSubmit={handleAddTodo}>
            <Input
              className="flex-1"
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              value={newTodoText}
            />
            <Button disabled={!newTodoText.trim() || createMutation.isPending} type="submit">
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Todo'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* All Todos */}
        <Card>
          <CardHeader>
            <CardTitle>All Todos ({allTodos?.length || 0})</CardTitle>
            <CardDescription>Complete list with live updates</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : allTodos?.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No todos yet</p>
            ) : (
              <ul className="space-y-2">
                {allTodos?.map((todo) => (
                  <li className="flex items-center justify-between rounded-md border p-2" key={todo.id}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        id={`todo-all-${todo.id}`}
                        onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                      />
                      <label
                        className={`text-sm ${todo.completed ? 'text-muted-foreground line-through' : ''}`}
                        htmlFor={`todo-all-${todo.id}`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      aria-label="Delete todo"
                      onClick={() => handleDeleteTodo(todo.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Pending Todos */}
        <Card>
          <CardHeader>
            <CardTitle>Pending ({pendingTodos?.length || 0})</CardTitle>
            <CardDescription>Live filtered view of incomplete tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTodos?.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No pending todos</p>
            ) : (
              <ul className="space-y-2">
                {pendingTodos?.map((todo) => (
                  <li className="flex items-center justify-between rounded-md border p-2" key={todo.id}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        id={`todo-pending-${todo.id}`}
                        onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                      />
                      <label className="text-sm" htmlFor={`todo-pending-${todo.id}`}>
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      aria-label="Delete todo"
                      onClick={() => handleDeleteTodo(todo.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Completed Todos */}
        <Card>
          <CardHeader>
            <CardTitle>Completed ({completedTodos?.length || 0})</CardTitle>
            <CardDescription>Live filtered view of finished tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {completedTodos?.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No completed todos</p>
            ) : (
              <ul className="space-y-2">
                {completedTodos?.map((todo) => (
                  <li className="flex items-center justify-between rounded-md border p-2" key={todo.id}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={todo.completed}
                        id={`todo-completed-${todo.id}`}
                        onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                      />
                      <label
                        className="text-muted-foreground text-sm line-through"
                        htmlFor={`todo-completed-${todo.id}`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      aria-label="Delete todo"
                      onClick={() => handleDeleteTodo(todo.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>TanStack DB Features</CardTitle>
          <CardDescription>Key benefits of this implementation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ Live Queries</h4>
              <p className="text-muted-foreground">
                Automatic reactive updates when data changes - no manual refetch needed
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ Reactive Updates</h4>
              <p className="text-muted-foreground">
                Automatic UI updates when data changes via TanStack Query integration
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ Filtered Views</h4>
              <p className="text-muted-foreground">Multiple live-filtered views from the same data source</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ Type Safety</h4>
              <p className="text-muted-foreground">Full TypeScript support with schema validation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
