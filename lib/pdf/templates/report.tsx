import React from 'react';
import {Document, Page, Text, View, StyleSheet, Font} from '@react-pdf/renderer';
import {SupabaseTask} from '@/lib/types/task';

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
            fontWeight: 'normal',
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
            fontWeight: 'medium',
        },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Roboto',
    },
    header: {
        marginBottom: 20,
        borderBottom: 2,
        borderBottomColor: '#333',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'medium',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
    },
    quarterSection: {
        marginTop: 20,
        marginBottom: 15,
    },
    quarterTitle: {
        fontSize: 16,
        fontWeight: 'medium',
        backgroundColor: '#f0f0f0',
        padding: 8,
        marginBottom: 10,
    },
    taskContainer: {
        marginBottom: 15,
        paddingLeft: 10,
    },
    taskName: {
        fontSize: 12,
        fontWeight: 'medium',
        marginBottom: 4,
    },
    taskDescription: {
        fontSize: 10,
        color: '#444',
        marginBottom: 4,
        marginLeft: 10,
    },
    taskDates: {
        fontSize: 9,
        color: '#666',
        marginLeft: 10,
        marginBottom: 4,
    },
    childrenContainer: {
        marginLeft: 20,
        marginTop: 8,
        borderLeft: 1,
        borderLeftColor: '#ccc',
        paddingLeft: 10,
    },
    childTask: {
        marginBottom: 10,
    },
    childTaskName: {
        fontSize: 11,
        fontWeight: 'medium',
        marginBottom: 3,
    },
    noTasks: {
        fontSize: 10,
        color: '#999',
        marginLeft: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#999',
    },
});

interface TasksPDFTemplateProps {
    year: number;
    quarterData: {
        quarter: 1 | 2 | 3 | 4;
        tasks: SupabaseTask[];
    }[];
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
};

const TaskItem: React.FC<{ task: SupabaseTask; isChild?: boolean }> = ({task, isChild = false}) => {
    const containerStyle = isChild ? styles.childTask : styles.taskContainer;
    const nameStyle = isChild ? styles.childTaskName : styles.taskName;

    return (
        <View style={containerStyle}>
            <Text style={nameStyle}>• {task.name}</Text>

            {task.description && (
                <Text style={styles.taskDescription}>{task.description}</Text>
            )}

            {(task.start_date || task.end_date) && (
                <Text style={styles.taskDates}>
                    {task.start_date && `Început: ${formatDate(task.start_date)}`}
                    {task.start_date && task.end_date && ' | '}
                    {task.end_date && `Sfârșit: ${formatDate(task.end_date)}`}
                </Text>
            )}

            {task.children && task.children.length > 0 && (
                <View style={styles.childrenContainer}>
                    {task.children.map((child) => (
                        <TaskItem key={child.id} task={child} isChild/>
                    ))}
                </View>
            )}
        </View>
    );
};

interface TasksPDFTemplateProps {
    year: number;
    quarterData: { quarter: 1 | 2 | 3 | 4; tasks: SupabaseTask[] }[]
}

export function TasksPDFTemplate ({year, quarterData}: TasksPDFTemplateProps) {
    const getQuarterName = (quarter: number): string => {
        return `Trimestrul ${quarter}`;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Raport de activitate {year}</Text>
                    <Text style={styles.subtitle}>
                        Generat la: {new Date().toLocaleDateString('ro-RO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                    </Text>
                </View>

                {quarterData.map(({quarter, tasks}) => (
                    <View key={quarter} style={styles.quarterSection} wrap={false}>
                        <Text style={styles.quarterTitle}>
                            {getQuarterName(quarter)} - {tasks.length}
                        </Text>

                        {tasks.length === 0 ? (
                            <Text style={styles.noTasks}>Nu există activități pentru acest trimestru.</Text>
                        ) : (
                            tasks.map((task) => (
                                <TaskItem key={task.id} task={task}/>
                            ))
                        )}
                    </View>
                ))}

                <Text style={styles.footer} fixed>
                    Pagina {String.fromCharCode(160)} - Raport activități {year}
                </Text>
            </Page>
        </Document>
    );
};