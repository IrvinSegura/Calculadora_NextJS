import { render, screen, fireEvent } from "@testing-library/react";
import Calculator from "@/components/Calculator";

describe("Calculadora", () => {
  test("calculo correcto de numeros de entrada", () => {
    render(<Calculator />);
  
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("*"));
    fireEvent.click(screen.getByText("7"));  
    fireEvent.click(screen.getByText("5"));  
    fireEvent.click(screen.getByText("="));
  
    expect(screen.getByText("25875")).toBeInTheDocument(); 
  });  

  test("limita la longitud maxima de numeros decimales", () => {
    render(<Calculator />);
    
    fireEvent.click(screen.getByText("9"));
    fireEvent.click(screen.getByText("/"));
    fireEvent.click(screen.getByText("7"));
    fireEvent.click(screen.getByText("="));
    
    expect(screen.getByText(/^1.2857142857$/)).toBeInTheDocument();
  });

  test("calculo correcto de numeros de entrada", () => {
    render(<Calculator />);
  
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("*"));
    fireEvent.click(screen.getByText("7"));  
    fireEvent.click(screen.getByText("5"));  
    fireEvent.click(screen.getByText("-"));  
    fireEvent.click(screen.getByText("5"));  
    fireEvent.click(screen.getByText("5"));  

    fireEvent.click(screen.getByText("="));
  
    expect(screen.getByText("25820")).toBeInTheDocument(); 
  });   

  test("calculo correcto de numeros de entrada", () => {
    render(<Calculator />);
  
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("/"));
    fireEvent.click(screen.getByText("7"));  
    fireEvent.click(screen.getByText("5"));  
    fireEvent.click(screen.getByText("+"));  
    fireEvent.click(screen.getByText("5"));  
    fireEvent.click(screen.getByText("5"));  

    fireEvent.click(screen.getByText("="));
  
    expect(screen.getByText("55.6")).toBeInTheDocument(); 
  });
});
