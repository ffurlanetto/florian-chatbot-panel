import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme2 } from "@grafana/ui";

interface Props {
    text: string;
}

export const MarkdownMessage: React.FC<Props> = ({ text }) => {
    const theme = useTheme2();

    return (
        <div
            style={{
                fontSize: theme.typography.body.fontSize,
                color: theme.colors.text.primary,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
            }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ children }) => (
                        <table
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                margin: "8px 0",
                            }}
                        >
                            {children}
                        </table>
                    ),
                    th: ({ children }) => (
                        <th
                            style={{
                                border: `1px solid ${theme.colors.border.weak}`,
                                padding: "6px 8px",
                                background: theme.colors.background.secondary,
                                textAlign: "left",
                            }}
                        >
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td
                            style={{
                                border: `1px solid ${theme.colors.border.weak}`,
                                padding: "6px 8px",
                            }}
                        >
                            {children}
                        </td>
                    ),
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
};
