import React from "react";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import "./styleHello.css";

const HelloWorldButton = () => {
  const { initialData } = useCMEditViewDataManager();

  // Дата создания записи
  const createdAt = initialData?.createdAt;

  return (
    <div>
      <p className="helloLine">
        Дата создания:{" "}
        {createdAt ? new Date(createdAt).toLocaleString() : "Нет данных"}
      </p>
    </div>
  );
};

export default HelloWorldButton;
