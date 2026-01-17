import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from "next/image";
import Link from "next/link";

const components: MDXComponents = {
    // Headings
    h1: props => (
        <h1
            className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-8 mb-4"
            {...props}
        />
    ),
    h2: props => (
        <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-8 mb-4 first:mt-0"
            {...props}
        />
    ),
    h3: props => (
        <h3
            className="scroll-m-20 text-2xl font-semibold tracking-tight mt-4"
            {...props}
        />
    ),
    h4: props => (
        <h4
            className="scroll-m-20 text-xl font-semibold tracking-tight mt-4 mb-2"
            {...props}
        />
    ),
    h5: props => (
        <h5
            className="scroll-m-20 text-lg font-semibold tracking-tight mt-4 mb-2"
            {...props}
        />
    ),
    h6: props => (
        <h6
            className="scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-2"
            {...props}
        />
    ),

    // Paragraphs and text
    p: props => (
        <p
            className="leading-7 [&:not(:first-child)]:mt-4"
            {...props}
        />
    ),

    // Links
    a: props => (
        <Link
            href={props.href || ''}
            className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            {...props}
        />
    ),

    // Lists
    ul: props => (
        <ul
            className="my-2 ml-6 list-disc [&>li]:mt-2"
            {...props}
        />
    ),
    ol: props => (
        <ol
            className="my-2 ml-6 list-decimal [&>li]:mt-2"
            {...props}
        />
    ),
    li: props => (
        <li
            className="leading-7"
            {...props}
        />
    ),

    // Blockquote
    blockquote: props => (
        <blockquote
            className="mt-6 border-l-4 border-gray-300 pl-6 italic text-gray-700 dark:border-gray-600 dark:text-gray-300"
            {...props}
        />
    ),

    // Code blocks and inline code
    code: props => {
        const isInline = !props.className;

        if (isInline) {
            return (
                <code
                    className="relative rounded bg-gray-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    {...props}
                />
            );
        }

        return (
            <code
                className="relative rounded font-mono text-sm"
                {...props}
            />
        );
    },
    pre: props => (
        <pre
            className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-gray-950 p-4 dark:bg-gray-900"
            {...props}
        />
    ),

    // Tables
    table: props => (
        <div className="my-6 w-full overflow-y-auto">
            <table
                className="w-full border-collapse border border-gray-300 dark:border-gray-700"
                {...props}
            />
        </div>
    ),
    thead: props => (
        <thead
            className="bg-gray-100 dark:bg-gray-800"
            {...props}
        />
    ),
    tbody: props => (
        <tbody
            {...props}
        />
    ),
    tr: props => (
        <tr
            className="border-b border-gray-300 dark:border-gray-700"
            {...props}
        />
    ),
    th: props => (
        <th
            className="px-4 py-2 text-left font-semibold [&[align=center]]:text-center [&[align=right]]:text-right"
            {...props}
        />
    ),
    td: props => (
        <td
            className="px-4 py-2 [&[align=center]]:text-center [&[align=right]]:text-right"
            {...props}
        />
    ),

    // Images
    img: props => {
        const imgProps = props as ImageProps;
        return (
            <Image
                {...imgProps}
                alt={imgProps.alt ?? ""}
                width={imgProps.width ?? 800}
                height={imgProps.height ?? 600}
                className="rounded-lg my-6"
            />
        );
    },

    // Horizontal rule
    hr: props => (
        <hr
            className="my-8 border-gray-300 dark:border-gray-700"
            {...props}
        />
    ),

    // Strong and emphasis
    strong: props => (
        <strong
            className="font-bold"
            {...props}
        />
    ),
    em: props => (
        <em
            className="italic"
            {...props}
        />
    ),
};

export function useMDXComponents(): MDXComponents {
    return components;
}