export const metadata = {
     title: 'Solon AI - Intelligent Code Review for Every Pull Request',
     description: 'Automate code quality checks on every pull request',
   }

   export default function RootLayout({ children }) {
     return (
       <html lang="en">
         <body>{children}</body>
       </html>
     )
   }
