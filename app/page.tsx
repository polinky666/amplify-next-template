"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator, DropZone, Text  } from "@aws-amplify/ui-react";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { uploadData } from "aws-amplify/storage";

Amplify.configure(outputs);

const client = generateClient<Schema>();

// AWS S3設定
// AWS.config.update({
//     region: 'ap-northeast-1', // あなたのリージョン
//     credentials: new AWS.Credentials('ACCESS-KEY', 'SECRET')
// });

// const s3 = new AWS.S3();
// const bucketName = 'hotcake-test-bucket-1118';

export default function App() {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [files, setFiles] = useState<Array<File>>([]);
  const { user, signOut } = useAuthenticator();
  // function listTodos() {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }

  // function delateTodo(id: string) {
  //   client.models.Todo.delete({ id });
  // }

  // function completeTodo(id: string) {
  //   client.models.Todo.update({ id, complete: true });
  // }

  // useEffect(() => {
  //   listTodos();
  // }, []);

  // function createTodo() {
  //   client.models.Todo.create({
  //     content: window.prompt("Todo content"),
  //     complete: false,
  //   });
  // }

  function uploadFile(){
    // const fileInput: HTMLInputElement | null = document.getElementById('fileInput') as HTMLInputElement;
    // const file = fileInput?.files?.[0];

    // if (!file) {
    //     const statusElem = document.getElementById('status');
    //     statusElem!.innerText = 'Please select a file.';
    //     return;
    // }
    for (const file of files) {  
      try {
          const result = uploadData({
            key: files[0].name,
            data: files[0],
            options:{ 
          // Alternatively, provide bucket name from console and associated region
              bucket: {
                bucketName: 'hotcake-test-bucket-1118',
                region: 'ap-northeast-1'
              }
            }
          }).result;
          console.log("Upload success:", result);    
        }catch (error) {
          console.error("Upload error:", error);
        } 
    };
    document.getElementById("status")!.innerText = "File uploaded";
  }

  return (
    <main>
      <h1>user:{user?.signInDetails?.loginId}</h1>
      <div>
        <DropZone
        onDropComplete={({ acceptedFiles, rejectedFiles }) => {
          setFiles(acceptedFiles);
        }}
      >
        Drag file here
      </DropZone>
      {files.map((file) => (
        <Text key={file.name}>{file.name}</Text>
      ))}
      </div>
      {/* <input type="file" id="fileInput" /> */}
      <button id="uploadButton" onClick={uploadFile}>Upload</button>
      <p id="status"></p>
      
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
