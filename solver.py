from collections import deque

def solve_maze_ucs(data):
    maze = data['maze']
    start = data['start']
    end = data['end']

    n = len(maze)
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    queue = deque()
    queue.append((start['x'], start['y'], []))
    visited = set()

    while queue:
        x, y, path = queue.popleft()

        if (x, y) in visited:
            continue

        visited.add((x, y))
        path = path + [(x, y)]

        if x == end['x'] and y == end['y']:
            return {"steps": len(path)-1, "path": path}

        for dx, dy in directions:
            nx, ny = x + dx, y + dy

            if 0 <= nx < n and 0 <= ny < n and maze[nx][ny] == 0:
                queue.append((nx, ny, path))

    return {"steps": -1, "path": []}