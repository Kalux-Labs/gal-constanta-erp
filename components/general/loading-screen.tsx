export default function LoadingScreen() {
    return (<div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    </div>)
}