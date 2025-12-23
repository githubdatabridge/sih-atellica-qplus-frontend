export type SubjectType<T> = (data: T) => void

export class Subject<T> {
    private observers: SubjectType<T>[] = []

    public attach(observer: SubjectType<T>) {
        this.observers.push(observer)
    }

    public detach(observer: SubjectType<T>) {
        this.observers = this.observers.filter(o => o !== observer)
    }

    public notify(data: T) {
        this.observers.forEach(o => o(data))
    }
}
