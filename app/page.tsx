"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Home, MapPin, Phone, Mail, Clock, Users, Shield, Star } from "lucide-react"
import { useEffect, useState } from "react"

// Constants
const WHATSAPP_NUMBER = '5511964300221'
const API_BASE_URL = 'http://localhost:3001'

export default function HomePage() {
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    renda: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Estado para o carrossel de empreendimentos
  const [currentProperty, setCurrentProperty] = useState(0)
  const [animationDirection, setAnimationDirection] = useState('fade-scale')
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Dados dos empreendimentos
  const properties = [
    {
      id: 1,
      name: "Astro Santa Marina",
      shortDescription: "Apartamentos de 1 e 2 dormitórios",
      price: "R$ 250.000",
      image: "/images/astro-santa-marina.png",
      location: "Zona Oeste, São Paulo",
      rooms: "1 e 2 dormitórios",
      area: "25m² a 38m²",
      parking: "0 vaga por unidade",
      amenities: ["Academia", "Piscina", "Playground", "Salão de festas", "Portaria 24h", "Entre outros..."],
      description: "Empreendimento moderno com apartamentos de 1 e 2 dormitórios, localizado em região privilegiada com fácil acesso ao novo metrô Santa Marinae principais vias de São Paulo. Unidades com acabamento de primeira qualidade e área privativa generosa."
    },
    {
      id: 2,
      name: "Cidade Villa Lobos - Melodia",
      shortDescription: "Apartamentos de 2 dormitórios com e sem terraço",
      price: "R$ 250.000",
      image: "/images/cidade-villa-lobos.png",
      location: "Zona Oeste, São Paulo",
      rooms: "2 dormitórios",
      area: "32m² a 38m²",
      parking: "0 vagas por unidade",
      amenities: ["Fitness", "Quadra esportiva", "Churrasqueira", "Playground", "Segurança 24h", "Entre outros..."],
      description: "Condomínio melodia com apartamentos de 2 dormitórios em frente ao Parque Villa Lobos, perfeito para famílias que buscam mais espaço e contato com a natureza."
    },
    {
      id: 3,
      name: "Next Guarulhos",
      shortDescription: "Apartamentos de 2 dormitórios",
      price: "R$ 265.000",
      image: "/images/next-guarulhos.jpg",
      location: "Guarulhos, São Paulo",
      rooms: "2 dormitórios",
      area: "34m² a 38m²",
      parking: "656 carros | 126 motos | 16 PCD | 65 visitantes",
      amenities: ["Sala de Descanso e Sauna", "Piscina", "Academia", "Lavanderia", "Oficina ", "Entre outros..."],
      description: "Adquirir um imóvel em Guarulhos significa ter o maior aeroporto da América Latina a poucos minutos de casa, tornando o momento de viajar ainda mais prazeroso. Unidades de 2 dormitórios com varanda gourmet e acabamento de luxo."
    }
  ]

  // Funções de navegação do carrossel
  const nextProperty = () => {
    setAnimationDirection('slide-right')
    setCurrentProperty((prev) => (prev + 1) % properties.length)
  }

  const prevProperty = () => {
    setAnimationDirection('slide-left')
    setCurrentProperty((prev) => (prev - 1 + properties.length) % properties.length)
  }

  const goToProperty = (index: number) => {
    if (index > currentProperty) {
      setAnimationDirection('slide-right')
    } else if (index < currentProperty) {
      setAnimationDirection('slide-left')
    } else {
      setAnimationDirection('fade-scale')
    }
    setCurrentProperty(index)
  }

  // Funções para o modal
  const openModal = (property: any) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProperty(null)
  }

  // Função para redirecionar para WhatsApp
  const redirectToWhatsApp = (message = '', includeFormData = false) => {
    let finalMessage = message
    
    if (includeFormData) {
      const formInfo = `
*Nome Completo:* ${formData.nome || 'Não informado'}
*E-mail:* ${formData.email || 'Não informado'}
*Telefone:* ${formData.telefone || 'Não informado'}
*Renda Familiar:* ${formData.renda || 'Não informado'}

${message}`
      finalMessage = formInfo
    }
    
    const encodedMessage = encodeURIComponent(finalMessage)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  // Funções de validação
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '')
    // Verifica se tem 10 ou 11 dígitos (com ou sem o 9)
    return cleanPhone.length === 10 || cleanPhone.length === 11
  }

  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '')
    
    // Se tem mais de 11 dígitos, limita a 11
    const limitedNumbers = numbers.slice(0, 11)
    
    // Aplica a máscara (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
    if (limitedNumbers.length <= 2) {
      return `(${limitedNumbers}`
    } else if (limitedNumbers.length <= 7) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`
    } else {
      const ddd = limitedNumbers.slice(0, 2)
      const firstPart = limitedNumbers.slice(2, 7)
      const secondPart = limitedNumbers.slice(7)
      return `(${ddd}) ${firstPart}-${secondPart}`
    }
  }

  const formatCurrency = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '')
    
    // Converte para número e divide por 100 para obter os centavos
    const amount = parseInt(numbers) / 100
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const parseCurrency = (value: string) => {
    // Remove R$, pontos e espaços, mantém apenas números e vírgula
    const cleanValue = value.replace(/[R$\s.]/g, '').replace(',', '.')
    return parseFloat(cleanValue) || 0
  }

  // Handlers de mudança
  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value
    let newErrors = { ...errors }

    switch (field) {
      case 'telefone':
        formattedValue = formatPhone(value)
        if (value && !validatePhone(value)) {
          newErrors.telefone = 'Telefone inválido. Use o formato (XX) 9XXXX-XXXX'
        } else {
          delete newErrors.telefone
        }
        break
      case 'email':
        if (value && !validateEmail(value)) {
          newErrors.email = 'Email inválido'
        } else {
          delete newErrors.email
        }
        break
      case 'renda':
        formattedValue = formatCurrency(value)
        break
      default:
        break
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    setErrors(newErrors)
  }

  useEffect(() => {
    // Intersection Observer para animações de scroll sutis
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up')
        }
      })
    }, observerOptions)

    // Observar todos os elementos com classe de animação
    const animatedElements = document.querySelectorAll('.fade-up-on-scroll')
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen">
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fade-up-on-scroll {
          opacity: 0;
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }

        .fade-up-delay-1 {
          animation-delay: 0.1s;
        }

        .fade-up-delay-2 {
          animation-delay: 0.2s;
        }

        .fade-up-delay-3 {
          animation-delay: 0.3s;
        }

        .fade-up-delay-4 {
          animation-delay: 0.4s;
        }

        .property-transition {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .property-image {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .property-content {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .property-content.slide-left {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .property-content.slide-right {
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .property-content.fade-scale {
          animation: fadeInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-backdrop {
          animation: modalFadeIn 0.3s ease-out;
        }

        .modal-content {
          animation: modalFadeIn 0.3s ease-out;
        }


                 .testimonial-card {
                   height: 320px;
                   display: flex;
                   flex-direction: column;
                   justify-content: space-between;
                 }

                 @media (max-width: 768px) {
                   .testimonial-card {
                     height: auto;
                     width: 100% !important;
                     min-width: 100% !important;
                     margin-bottom: 2rem;
                   }

                   .mobile-carousel-container {
                     width: 100% !important;
                     margin-left: 0 !important;
                   }

                   .mobile-carousel-container .testimonials-carousel {
                     width: 100% !important;
                     flex-direction: column !important;
                     gap: 1.5rem !important;
                   }
                   
                   .testimonials-carousel .testimonial-card:nth-child(n+4) {
                     display: block !important;
                   }
                 }

                 @media (min-width: 769px) {
                   .testimonials-carousel {
                     width: 100% !important;
                     animation: none !important;
                   }
                   
                   .testimonials-carousel .testimonial-card {
                     width: calc((100% - 3rem) / 3) !important;
                     min-width: calc((100% - 3rem) / 3) !important;
                     flex-shrink: 0;
                   }
                   
                   .testimonials-carousel .testimonial-card:nth-child(n+4) {
                     display: none;
                   }
                 }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        {/* Imagem de fundo - desktop */}
        <div className="hidden lg:block absolute inset-0 bg-cover bg-right-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero_couple.png')" }}></div>
        
        {/* Imagem de fundo - mobile */}
        <div className="block lg:hidden absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero_couple2.png')" }}></div>
        
        {/* Overlay gradiente azul com laranja transparente */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-blue-500/70 to-orange-500/0 z-0"></div>
        <div className="container mx-auto px-4 py-8 md:py-16 relative z-10 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center w-full">
            <div className="text-white space-y-4 sm:space-y-6 md:space-y-8 fade-up-on-scroll lg:col-span-1 text-center lg:text-left">
              <div className="flex items-center gap-2 mb-4 md:mb-6 justify-center lg:justify-start">
                <div className="bg-white p-3 rounded-lg">
                  <img src="/mcmv.webp" alt="MCMV" className="h-10 w-10 md:h-10 md:w-10" />
                </div>
                <span className="text-base md:text-sm font-medium">Financiamento Habitacional</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Conquiste o Seu Sonho da Casa Própria Sem Complicações e Sem Burocracia
              </h1>

              <p className="text-lg sm:text-xl md:text-xl text-blue-100 leading-relaxed max-w-lg">
                Realizamos o sonho da casa própria de milhares de famílias brasileiras. Financiamento facilitado, sem
                burocracia e com as melhores condições do mercado.
              </p>

              <div className="flex justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => redirectToWhatsApp('Olá! Gostaria de simular um financiamento habitacional.')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 md:px-8 py-4 md:py-4 text-lg md:text-lg font-semibold rounded-full w-full md:w-auto cursor-pointer"
              >
                Simule Agora Gratuitamente
              </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-base">100% Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-base">Sem Burocracia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-base">Aprovação Rápida</span>
                </div>
              </div>
            </div>

            </div>
          
        </div>
      </section>

      {/* Simulation Section */}
      <section id="simulation-section" className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
            <div className="space-y-4 md:space-y-5 fade-up-on-scroll">
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 text-balance">
                Você Sonha Com a Casa Própria, mas a Jornada Parece Cheia de Obstáculos?
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Sabemos que conquistar a casa própria pode parecer um desafio impossível. Entre a burocracia dos bancos,
                documentação complexa e taxas abusivas, muitas famílias desistem do sonho.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                Mas e se disséssemos que existe um caminho mais simples? Nossa equipe especializada já ajudou mais de
                10.000 famílias a conquistarem a casa própria de forma rápida e descomplicada.
              </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <Avatar className="border-2 border-white">
                    <AvatarImage src="/happy-customer-1.png" />
                    <AvatarFallback>C1</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-white">
                    <AvatarImage src="/happy-customer-2.png" />
                    <AvatarFallback>C2</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-white">
                    <AvatarImage src="/happy-customer-3.png" />
                    <AvatarFallback>C3</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-white">
                    <AvatarImage src="/happy-customer-4.jpg" />
                    <AvatarFallback>C4</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">+10.000 famílias atendidas</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">4.9/5 avaliação</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-up-on-scroll fade-up-delay-1">
              <Card className="p-4 md:p-6 shadow-xl">
                <div className="text-center mb-4">
                  <div className="bg-blue-600 p-2 md:p-3 rounded-full w-fit mx-auto mb-3">
                    <Home className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Faça sua Simulação</h3>
                  <p className="text-sm md:text-base text-gray-600">Descubra quanto você pode financiar</p>
              </div>

              <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <Input 
                    placeholder="Digite seu nome completo" 
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <Input 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone/WhatsApp</label>
                  <Input 
                    placeholder="(11) 99999-9999" 
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                  />
                  {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renda Familiar</label>
                  <Input 
                    placeholder="R$ 0,00" 
                    value={formData.renda}
                    onChange={(e) => handleInputChange('renda', e.target.value)}
                  />
                </div>
                </div>

                  <Button 
                    onClick={() => redirectToWhatsApp('Olá! Preenchi o formulário e gostaria de simular um financiamento habitacional.', true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base md:text-lg font-semibold cursor-pointer">
                  Simular Financiamento
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Seus dados estão protegidos e não serão compartilhados
                </p>
              </form>
            </Card>
            </div>
          </div>
          
          {/* Subtle scroll indicator */}
          <div className="text-center mt-8 fade-up-on-scroll fade-up-delay-3">
            <div className="inline-flex items-center text-gray-400 text-sm">
              <span>Mais serviços abaixo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12 fade-up-on-scroll">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">O que Fazemos por Você</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa equipe especializada cuida de todo o processo para que você realize o sonho da casa própria sem
              complicações
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
            <div className="space-y-5 md:space-y-6 fade-up-on-scroll fade-up-delay-1">
              <div className="flex gap-3 md:gap-4">
                <div className="bg-blue-600 p-2 md:p-3 rounded-full flex-shrink-0">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    Consultoria Personalizada para Financiamento Habitacional
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Analisamos seu perfil e encontramos as melhores opções de financiamento
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Análise completa do seu perfil</li>
                    <li>• Orientação sobre documentação</li>
                    <li>• Simulações personalizadas</li>
                    <li>• Acompanhamento especializado</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 p-3 rounded-full flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Imóveis em Localizações Privilegiadas com Padrão Valor Real
                  </h3>
                  <p className="text-gray-600 mb-3">Selecionamos os melhores imóveis em localização estratégica</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Mais de 500 opções disponíveis</li>
                    <li>• Localização privilegiada</li>
                    <li>• Padrão de qualidade superior</li>
                    <li>• Infraestrutura completa</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="bg-blue-600 p-2 md:p-3 rounded-full flex-shrink-0">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    Acompanhamento Completo - Do Contrato ao Sonho Realizado
                  </h3>
                  <p className="text-gray-600 mb-3">Cuidamos de todo o processo até a entrega das chaves</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Suporte jurídico completo</li>
                    <li>• Acompanhamento da obra</li>
                    <li>• Gestão de documentos</li>
                    <li>• Entrega das chaves</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3 fade-up-on-scroll fade-up-delay-2">
              <img
                src="/images/property-1.jpg"
                alt="Empreendimento Valor Real"
                className="w-full h-32 md:h-40 object-cover rounded-lg"
              />
              <img
                src="/images/property-2.jpg"
                alt="Consultoria especializada"
                className="w-full h-32 md:h-40 object-cover rounded-lg"
              />
              <img
                src="/images/property-3.jpg"
                alt="Imóveis de qualidade"
                className="w-full h-32 md:h-40 object-cover rounded-lg col-span-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-10 md:py-12 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
            <div className="relative fade-up-on-scroll">
              <img
                src="/images/cury-5anos.png"
                alt="Profissional Valor Real"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">10.000+</p>
                  <p className="text-sm text-gray-600">Famílias Atendidas</p>
                </div>
              </div>
            </div>

            <div className="text-white space-y-4 md:space-y-5 fade-up-on-scroll fade-up-delay-1">
              <h2 className="text-2xl md:text-4xl font-bold text-balance">
                Nossa Jornada é Compromisso com Você
              </h2>

              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
               A Cury Construtora é uma companhia que atua na construção e na incorporação de unidades habitacionais,
               valorizando o sonho de milhares de pessoas que buscam um residencial completo para uma vida digna.
               Com mais de 60 anos, nossa história já se estende pelas principais regiões metropolitanas de São Paulo e do Rio de Janeiro, no Brasil.
 
 
               </p>

               <p className="text-base md:text-lg text-blue-100 leading-relaxed">
               Hoje, somos uma empresa de capital aberto, listada desde 2020 no Novo Mercado da B3 (código CURY3),
               líder em incorporação econômica, com ampla atuação nos segmentos de médio padrão.
               </p>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">60+</p>
                  <p className="text-blue-100">Anos de Experiência</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">98%</p>
                  <p className="text-blue-100">Taxa de Aprovação</p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => redirectToWhatsApp('Olá! Gostaria de conhecer mais sobre a história da Valor Real.')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full cursor-pointer"
              >
                Conheça Nossa História
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-10 fade-up-on-scroll">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Depoimentos</h2>
            <p className="text-lg md:text-xl text-gray-600">Veja o que nossos clientes falam sobre nós</p>
          </div>

          <div className="fade-up-on-scroll fade-up-delay-1">
            <div className="relative overflow-hidden mobile-carousel-container">
              <div className="flex gap-6 transition-transform duration-1000 ease-linear testimonials-carousel">
                {/* Todos os 6 cards em um único conjunto */}
                <Card className="p-6 flex-shrink-0 testimonial-card w-full md:w-1/3">
                  <CardContent className="p-0 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow text-sm md:text-base">
                  "Sempre sonhei com a casa própria, mas achava impossível. A equipe da Valor Real me ajudou em todo o
                  processo, desde a documentação até a entrega das chaves. Hoje moro no meu apartamento dos sonhos!"
                </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Avatar className="w-12 h-12 md:w-10 md:h-10">
                    <AvatarImage src="/happy-woman-customer.png" />
                        <AvatarFallback className="text-sm">MC</AvatarFallback>
                  </Avatar>
                  <div>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">Maria Clara</p>
                    <p className="text-sm text-gray-600">Professora, São Paulo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="p-6 flex-shrink-0 testimonial-card w-full md:w-1/3 hidden md:block">
                  <CardContent className="p-0 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow text-sm md:text-base">
                  "Processo super rápido e sem burocracia. Em menos de 60 dias estava com o financiamento aprovado. A
                  equipe é muito profissional e sempre disponível para esclarecer dúvidas. Recomendo!"
                </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Avatar className="w-12 h-12 md:w-10 md:h-10">
                    <AvatarImage src="/happy-man-customer.png" />
                        <AvatarFallback className="text-sm">RS</AvatarFallback>
                  </Avatar>
                  <div>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">Roberto Silva</p>
                    <p className="text-sm text-gray-600">Engenheiro, Rio de Janeiro</p>
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="p-6 flex-shrink-0 testimonial-card w-full md:w-1/3 hidden md:block">
                  <CardContent className="p-0 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow text-sm md:text-base">
                      "Excelente atendimento! Conseguiram aprovar meu financiamento mesmo com minha renda um pouco apertada. 
                      Hoje estou morando na minha casa dos sonhos. Valeu muito a pena!"
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Avatar className="w-12 h-12 md:w-10 md:h-10">
                        <AvatarImage src="/happy-customer-1.png" />
                        <AvatarFallback className="text-sm">AL</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">Ana Luiza</p>
                        <p className="text-sm text-gray-600">Enfermeira, Belo Horizonte</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 flex-shrink-0 testimonial-card w-full md:w-1/3">
                  <CardContent className="p-0 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow text-sm md:text-base">
                      "Minha experiência foi incrível! A equipe me orientou em cada passo do processo. 
                      Sempre que tinha dúvidas, eles estavam disponíveis para esclarecer. Recomendo de olhos fechados!"
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Avatar className="w-12 h-12 md:w-10 md:h-10">
                        <AvatarImage src="/happy-customer-2.png" />
                        <AvatarFallback className="text-sm">JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">João Santos</p>
                        <p className="text-sm text-gray-600">Vendedor, Salvador</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 flex-shrink-0 testimonial-card w-full md:w-1/3 hidden md:block">
                  <CardContent className="p-0 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow text-sm md:text-base">
                      "Consegui financiar 100% do meu apartamento! A Valor Real me ajudou a encontrar a melhor 
                      condição possível. Estou muito feliz com o resultado e agradecido pela dedicação da equipe."
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Avatar className="w-12 h-12 md:w-10 md:h-10">
                        <AvatarImage src="/happy-customer-3.png" />
                        <AvatarFallback className="text-sm">FC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">Fernanda Costa</p>
                        <p className="text-sm text-gray-600">Designer, Recife</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 flex-shrink-0 testimonial-card w-full md:w-1/3 hidden md:block">
                  <CardContent className="p-0 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow text-sm md:text-base">
                      "Atendimento excepcional! Me ajudaram a usar meu FGTS como entrada e conseguiram uma taxa 
                      de juros excelente. Processo rápido e sem complicações. Super indico!"
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Avatar className="w-12 h-12 md:w-10 md:h-10">
                        <AvatarImage src="/happy-customer-4.jpg" />
                        <AvatarFallback className="text-sm">MR</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">Marcos Rocha</p>
                        <p className="text-sm text-gray-600">Mecânico, Brasília</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-5 md:space-y-6 fade-up-on-scroll">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-balance">
              Transforme Seu Sonho em Realidade
            </h2>

            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Chegou a Hora de Conquistar o Sonho do Seu Novo Apartamento Sem Complicações e Sem Burocracia
            </p>

            <p className="text-base md:text-lg text-blue-100">
              Não deixe o sonho da imóvel próprio para depois. Nossa equipe está pronta para ajudar você a dar o primeiro
              passo rumo à conquista do seu lar.
            </p>

            <Button
              size="lg"
              onClick={() => redirectToWhatsApp('Olá! Quero simular um financiamento habitacional agora mesmo!')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 md:px-12 py-3 md:py-4 text-base md:text-xl font-semibold rounded-full w-full md:w-auto cursor-pointer"
            >
              Quero Simular Agora
            </Button>

            <div className="flex items-center justify-center gap-8 pt-6 text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Sem Compromisso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Resultado Imediato</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-up-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Conheça Nossos Empreendimentos</h2>
            <p className="text-xl text-gray-600">Imóveis de qualidade em localização privilegiada</p>
          </div>

          <div className="relative fade-up-on-scroll fade-up-delay-1">
            {/* Botões de navegação */}
            <button 
              onClick={prevProperty}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg z-20 transition-all duration-300 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextProperty}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg z-20 transition-all duration-300 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <img
              src={properties[currentProperty].image}
              alt={properties[currentProperty].name}
              className="w-full h-96 object-cover rounded-2xl shadow-2xl property-image"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center overflow-hidden property-transition">
              {/* Imagem de fundo do container */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 property-image"
                style={{ backgroundImage: `url('${properties[currentProperty].image}')` }}
              ></div>
              
              <div className={`text-center text-white space-y-4 relative z-10 property-content ${animationDirection}`}>
                <h3 className="text-3xl font-bold">{properties[currentProperty].name}</h3>
                <p className="text-xl">{properties[currentProperty].shortDescription}</p>
                <div className="flex flex-col items-center space-y-3">
                  <Badge className="bg-orange-500 text-white px-4 py-2 text-lg">A partir de {properties[currentProperty].price}</Badge>
                  <Button 
                    onClick={() => openModal(properties[currentProperty])}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 px-6 py-3 text-lg font-semibold cursor-pointer transition-all duration-300"
                  >
                    Ver Mais
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores de empreendimentos */}
          <div className="flex justify-center mt-8 space-x-2">
            {properties.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProperty(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentProperty ? 'bg-orange-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Detalhes do Empreendimento */}
      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-backdrop">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-content">
            <div className="relative">
              {/* Imagem de cabeçalho */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.name}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-orange-500 text-white px-4 py-2 text-lg font-semibold">
                    A partir de {selectedProperty.price}
                  </Badge>
                </div>
              </div>

              {/* Conteúdo do modal */}
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Informações principais */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {selectedProperty.name}
                      </h2>
                      <p className="text-lg text-gray-600 mb-4">
                        {selectedProperty.shortDescription}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedProperty.description}
                      </p>
                    </div>

                    {/* Detalhes técnicos */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Detalhes do Empreendimento</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Localização</p>
                          <p className="font-semibold text-gray-900">{selectedProperty.location}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Dormitórios</p>
                          <p className="font-semibold text-gray-900">{selectedProperty.rooms}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Área</p>
                          <p className="font-semibold text-gray-900">{selectedProperty.area}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Vagas</p>
                          <p className="font-semibold text-gray-900">{selectedProperty.parking}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comodidades e ações */}
                  <div className="space-y-6">
                    {/* Comodidades */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Comodidades</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedProperty.amenities.map((amenity: string, index: number) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <Button
                        onClick={() => {
                          closeModal()
                          redirectToWhatsApp(`Olá! Tenho interesse no empreendimento ${selectedProperty.name}. Gostaria de mais informações sobre disponibilidade e condições de pagamento.`)
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold cursor-pointer"
                      >
                        Tenho Interesse
                      </Button>
                      <Button
                        onClick={() => {
                          closeModal()
                          redirectToWhatsApp(`Olá! Gostaria de agendar uma visita ao empreendimento ${selectedProperty.name}.`)
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold cursor-pointer"
                      >
                        Agendar Visita
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12 fade-up-on-scroll">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Dúvidas Frequentes</h2>
            <p className="text-lg md:text-xl text-gray-600">Esclarecemos as principais dúvidas sobre financiamento habitacional</p>
          </div>

          <div className="max-w-3xl mx-auto fade-up-on-scroll fade-up-delay-1">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Qual valor mínimo de renda para conseguir financiamento?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">
                  O valor mínimo varia conforme o programa de financiamento escolhido. Para o Minha Casa Minha Vida, por
                  exemplo, a renda familiar pode ser de até R$ 12.000,00. Nossa equipe analisa seu perfil e encontra a
                  melhor opção para sua situação.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Quanto tempo demora para aprovar o financiamento?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">
                  Com nossa assessoria especializada, o processo de aprovação pode levar entre 12 a 48 horas. Cuidamos de
                  toda a documentação e acompanhamos cada etapa para agilizar ao máximo sua aprovação.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Posso usar meu FGTS como entrada?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">
                  Sim! O FGTS pode ser utilizado como entrada e também para amortizar o saldo devedor. Nossa equipe te
                  orienta sobre todas as possibilidades de uso do seu FGTS no financiamento.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">Qual a taxa de juros praticada?</AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">
                  As taxas variam conforme o programa de financiamento e seu perfil. Trabalhamos com as melhores
                  instituições financeiras, como a Caixa Econômica Federal, para conseguir as menores taxas do mercado para nossos clientes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  É possível financiar 100% do valor do imóvel?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">
                  Dependendo do programa e do seu perfil, é possível financiar até 100% do valor do imóvel. Fazemos uma
                  análise completa para encontrar a melhor condição para você.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
            <div className="lg:col-span-2 fade-up-on-scroll">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">Kako da Cury</span>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Há mais de 60 anos realizando o sonho do imóvel próprio de milhares de famílias brasileiras. Financiamento
                habitacional sem complicações e com as melhores condições do mercado.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <span>(11) 96430-0221</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <span>contato@kakodacury.com.br</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>

            <div className="fade-up-on-scroll fade-up-delay-1">
              <h3 className="text-lg font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Financiamento Habitacional</li>
                <li>Minha Casa Minha Vida</li>
                <li>Consultoria Imobiliária</li>
                <li>Análise de Crédito</li>
                <li>Documentação</li>
              </ul>
            </div>

            <div className="fade-up-on-scroll fade-up-delay-2">
              <h3 className="text-lg font-semibold mb-4">Atendimento</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Segunda a Sexta: 8h às 20h
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Sábado: 8h às 18h
                </li>
              </ul>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Fale Conosco</h4>
                <Button 
                  onClick={() => redirectToWhatsApp('Olá! Gostaria de falar sobre financiamento habitacional.')}
                  className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer">WhatsApp</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 fade-up-on-scroll fade-up-delay-3">
            <p>&copy; 2025 Kako da Cury. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}