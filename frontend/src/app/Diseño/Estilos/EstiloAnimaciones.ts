// Estilos de animaciones para el dashboard
// Define todas las animaciones CSS utilizadas en el dashboard

export const estiloAnimaciones = `
  @keyframes particle1 {
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
      opacity: 0.6;
    }
    50% { 
      transform: translate(50px, -30px) scale(1.2); 
      opacity: 1;
    }
  }
  
  @keyframes particle2 {
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
      opacity: 0.7;
    }
    50% { 
      transform: translate(-40px, 20px) scale(1.1); 
      opacity: 1;
    }
  }
  
  @keyframes particle3 {
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
      opacity: 0.5;
    }
    33% { 
      transform: translate(30px, -40px) scale(1.3); 
      opacity: 0.9;
    }
    66% { 
      transform: translate(-20px, 30px) scale(0.8); 
      opacity: 1;
    }
  }
  
  @keyframes particle4 {
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
      opacity: 0.8;
    }
    50% { 
      transform: translate(-60px, -40px) scale(1.4); 
      opacity: 1;
    }
  }
  
  @keyframes particle5 {
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
      opacity: 0.6;
    }
    25% { 
      transform: translate(40px, -20px) scale(1.2); 
      opacity: 1;
    }
    75% { 
      transform: translate(-30px, 40px) scale(0.9); 
      opacity: 0.8;
    }
  }
  
  @keyframes particle6 {
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
      opacity: 0.7;
    }
    50% { 
      transform: translate(50px, 20px) scale(1.1); 
      opacity: 1;
    }
  }
  
  @keyframes twinkle {
    0%, 100% { 
      opacity: 0; 
      transform: scale(0); 
    }
    50% { 
      opacity: 1; 
      transform: scale(2); 
    }
  }
  
  @keyframes patternMove {
    0% { 
      transform: translateX(0) translateY(0); 
    }
    50% { 
      transform: translateX(10px) translateY(-5px); 
    }
    100% { 
      transform: translateX(0) translateY(0); 
    }
  }
  
  @keyframes energyWave1 {
    0%, 100% { 
      transform: translateX(-30px) translateY(0) rotate(-8deg); 
      opacity: 0.05;
    }
    50% { 
      transform: translateX(30px) translateY(-15px) rotate(-6deg); 
      opacity: 0.08;
    }
  }
  
  @keyframes energyWave2 {
    0%, 100% { 
      transform: translateX(0) translateY(0) rotate(12deg); 
      opacity: 0.05;
    }
    50% { 
      transform: translateX(-20px) translateY(10px) rotate(10deg); 
      opacity: 0.07;
    }
  }
  
  @keyframes energyWave3 {
    0%, 100% { 
      transform: translateX(-20px) translateY(0) rotate(-5deg); 
      opacity: 0.05;
    }
    50% { 
      transform: translateX(25px) translateY(-10px) rotate(-3deg); 
      opacity: 0.07;
    }
  }
  
  @keyframes megaFloat1 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg) scale(1); 
      border-radius: 60% 40% 60% 40% / 60% 30% 70% 40%;
    }
    50% { 
      transform: translate(40px, -30px) rotate(180deg) scale(1.2); 
      border-radius: 40% 60% 30% 70% / 30% 60% 40% 70%;
    }
  }
  
  @keyframes megaFloat2 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg) scale(1); 
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
    50% { 
      transform: translate(-30px, 40px) rotate(180deg) scale(1.1); 
      border-radius: 70% 30% 40% 60% / 60% 40% 30% 70%;
    }
  }
  
  @keyframes megaFloat3 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg) scale(1); 
      border-radius: 40% 60% 30% 70% / 40% 70% 60% 30%;
    }
    33% { 
      transform: translate(25px, -40px) rotate(120deg) scale(1.3); 
      border-radius: 60% 40% 70% 30% / 30% 60% 40% 70%;
    }
    66% { 
      transform: translate(-35px, 20px) rotate(240deg) scale(0.9); 
      border-radius: 30% 70% 40% 60% / 70% 30% 60% 40%;
    }
  }
  
  @keyframes megaFloat4 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg) scale(1); 
      border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%;
    }
    50% { 
      transform: translate(-40px, -35px) rotate(180deg) scale(1.2); 
      border-radius: 30% 70% 40% 60% / 70% 30% 60% 40%;
    }
  }
  
  @keyframes megaFloat5 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg) scale(1); 
      border-radius: 50% 50% 20% 80% / 25% 55% 45% 75%;
    }
    50% { 
      transform: translate(60px, 15px) rotate(180deg) scale(1.1); 
      border-radius: 80% 20% 50% 50% / 55% 25% 75% 45%;
    }
  }
  
  @keyframes megaFloat6 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg) scale(1); 
      border-radius: 80% 20% 60% 40% / 20% 80% 40% 60%;
    }
    50% { 
      transform: translate(-25px, -45px) rotate(180deg) scale(1.15); 
      border-radius: 20% 80% 40% 60% / 80% 20% 60% 40%;
    }
  }
  
  @keyframes megaFloat7 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg) scale(1); 
      border-radius: 60% 40% 80% 20% / 50% 70% 30% 50%;
    }
    50% { 
      transform: translate(45px, -35px) rotate(180deg) scale(1.2); 
      border-radius: 40% 60% 20% 80% / 70% 50% 50% 30%;
    }
  }
  
  @keyframes aurora {
    0%, 100% { 
      opacity: 0.03; 
      transform: translateY(0);
    }
    50% { 
      opacity: 0.05; 
      transform: translateY(-10px);
    }
  }
  
  @keyframes centralGlow {
    0%, 100% { 
      opacity: 0.02; 
      transform: translate(-50%, -50%) scale(1);
    }
    50% { 
      opacity: 0.03; 
      transform: translate(-50%, -50%) scale(1.05);
    }
  }
  
  @keyframes float1 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg); 
    }
    50% { 
      transform: translate(30px, -20px) rotate(180deg); 
    }
  }
  
  @keyframes float2 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg); 
    }
    50% { 
      transform: translate(-25px, 30px) rotate(180deg); 
    }
  }
  
  @keyframes float3 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg); 
    }
    50% { 
      transform: translate(35px, -25px) rotate(180deg); 
    }
  }
  
  @keyframes float4 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg); 
    }
    50% { 
      transform: translate(-30px, 35px) rotate(180deg); 
    }
  }
  
  @keyframes float5 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg); 
    }
    50% { 
      transform: translate(25px, -30px) rotate(180deg); 
    }
  }
  
  @keyframes float6 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg); 
    }
    50% { 
      transform: translate(-35px, 25px) rotate(180deg); 
    }
  }
`;
