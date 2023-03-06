interface Props {
  children: JSX.Element,
}

export default function CenteredContent({
  children,
}: Props) {
  return (
    <div className="row">
      <div className="col-0 col-md-3"></div>
      <div className="col-12 col-md-6">
        <div className="container">
          {children}
        </div>
      </div>
      <div className="col-0 col-md-3">
      </div>
    </div>
  )
}
